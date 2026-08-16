(() => {
  // Shown before the list is expanded. Names not in companies.json are ignored.
  const FEATURED = ["Coinbase", "Dropbox", "StackAdapt", "Stripe", "Uber"];

  const form = document.getElementById("company-filter");
  const input = document.getElementById("company-search");
  const list = document.getElementById("company-list");
  const status = document.getElementById("company-status");
  const empty = document.getElementById("company-empty");
  const emptyQuery = document.getElementById("company-empty-query");
  const emptyMail = document.getElementById("company-empty-mail");
  const hint = document.querySelector("#companies .hint");
  const toggle = document.getElementById("company-toggle");
  const toggleLabel = document.getElementById("company-toggle-label");

  if (!form || !input || !list || !status || !empty || !emptyQuery) return;

  let companies = unique(readInitial(list));
  let expanded = false;

  form.hidden = false;

  // The toggle rides in the chip row as a list item. Moving the markup button
  // in (rather than rebuilding it) keeps its listener across re-renders.
  const moreItem = toggle ? document.createElement("li") : null;
  if (moreItem) {
    moreItem.className = "company-more";
    toggle.hidden = false;
    moreItem.appendChild(toggle);
  }

  const params = new URLSearchParams(location.search);
  const initial = params.get("q");
  if (initial) input.value = initial;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    input.blur();
  });

  input.addEventListener("input", () => render(input.value));

  if (toggle) {
    toggle.addEventListener("click", () => {
      expanded = !expanded;
      render(input.value);
    });
  }

  // Collapse from the markup list first, so the full list never flashes.
  render(input.value);
  load().then(() => render(input.value));

  async function load() {
    try {
      const response = await fetch("companies.json", { cache: "no-cache" });
      if (!response.ok) return;
      const data = await response.json();
      const names = unique(
        (Array.isArray(data) ? data : [])
          .filter((name) => typeof name === "string")
          .map((name) => name.trim())
          .filter(Boolean),
      );
      if (names.length) companies = names;
    } catch {
      // Keep the markup list, or the fallback already applied.
    }
  }

  function render(rawQuery) {
    const query = rawQuery.trim();
    const needle = normalize(query);

    // A search always looks at every company; collapsing only applies at rest.
    const featured = pickFeatured();
    const collapsible = !needle && featured.length < companies.length;
    const shown = needle
      ? companies.filter((name) => normalize(name).includes(needle))
      : collapsible && !expanded
        ? featured
        : companies.slice();

    if (toggle) {
      toggle.setAttribute("aria-expanded", String(collapsible && expanded));
      if (toggleLabel) {
        toggleLabel.textContent = expanded
          ? "Show fewer"
          : `Show all ${companies.length}`;
      }
    }

    const items = shown.map((name) => {
      const item = document.createElement("li");
      item.textContent = name;
      return item;
    });
    if (moreItem && collapsible) items.push(moreItem);

    list.replaceChildren(...items);

    const total = companies.length;
    if (!needle) {
      status.textContent = total === 1 ? "1 company" : `${total} companies`;
    } else if (shown.length) {
      status.textContent = `${shown.length} of ${total}`;
    } else {
      status.textContent = "No match";
    }

    const none = shown.length === 0;
    empty.hidden = !none;
    if (hint) hint.hidden = none;
    if (none) {
      emptyQuery.textContent = query;
      if (emptyMail) {
        const subject = `Please watch ${query}`;
        const body = `Could you add ${query} to the list?`;
        emptyMail.href = `mailto:hello@jobsub.app?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      }
    }
  }

  function pickFeatured() {
    const wanted = new Set(FEATURED.map(normalize));
    return companies.filter((name) => wanted.has(normalize(name)));
  }

  function readInitial(node) {
    return [...node.querySelectorAll("li")]
      .map((item) => item.textContent.trim())
      .filter(Boolean);
  }

  function unique(names) {
    const seen = new Set();
    const out = [];
    for (const name of names) {
      const key = normalize(name);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      out.push(name);
    }
    out.sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }));
    return out;
  }

  function normalize(value) {
    return value
      .toLowerCase()
      .normalize("NFKD")
      .replace(/\p{M}/gu, "")
      .replace(/[^a-z0-9]+/g, "");
  }
})();
