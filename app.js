(() => {
  const form = document.getElementById("company-filter");
  const input = document.getElementById("company-search");
  const list = document.getElementById("company-list");
  const status = document.getElementById("company-status");
  const empty = document.getElementById("company-empty");
  const emptyQuery = document.getElementById("company-empty-query");
  const emptyMail = document.getElementById("company-empty-mail");
  const hint = document.querySelector("#companies .hint");

  if (!form || !input || !list || !status || !empty || !emptyQuery) return;

  let companies = unique(readInitial(list));

  form.hidden = false;

  const params = new URLSearchParams(location.search);
  const initial = params.get("q");
  if (initial) input.value = initial;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    input.blur();
  });

  input.addEventListener("input", () => render(input.value));

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
    const shown = needle
      ? companies.filter((name) => normalize(name).includes(needle))
      : companies.slice();

    list.replaceChildren(
      ...shown.map((name) => {
        const item = document.createElement("li");
        item.textContent = name;
        return item;
      }),
    );

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
