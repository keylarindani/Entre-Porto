// Collabify — JS interaktif (filter + wizard + localStorage)
;(() => {
  const $ = (sel, ctx = document) => ctx.querySelector(sel)
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel))

  // Dummy data mitra
  const partners = [
    {
      type: "company",
      name: "Nusantara Foods",
      industry: "F&B",
      location: "Jakarta",
      rating: 4.6,
      needs: ["Distribusi", "Brand Awareness"],
      competencies: ["Produksi F&B", "R&D Produk"],
      pitch: "Mencari mitra distribusi regional dan co-marketing untuk lini RTD.",
      tags: ["RTD", "Retail"],
    },
    {
      type: "company",
      name: "LogistiX ID",
      industry: "Logistik",
      location: "Surabaya",
      rating: 4.3,
      needs: ["Partnership regional", "Integrasi sistem"],
      competencies: ["Distribusi", "Cold Chain"],
      pitch: "Optimasi cold chain & integrasi sistem untuk efisiensi rute.",
      tags: ["IoT"],
    },
    {
      type: "company",
      name: "Kopi Nusantara",
      industry: "F&B",
      location: "Jakarta",
      rating: 4.4,
      needs: ["Distribusi", "Pemasaran"],
      competencies: ["Leadership", "Manajemen Proyek"],
      pitch: "Butuh mitra distribusi regional untuk ekspansi gerai RTD.",
      tags: ["Arabika", "RTD", "Retail"],
    },
    {
      type: "company",
      name: "SaaS QuickOps",
      industry: "Teknologi",
      location: "Bandung",
      rating: 4.5,
      needs: ["Pendanaan", "Pemasaran"],
      competencies: ["Analisis Data", "Pemasaran Digital"],
      pitch: "Platform otomasi operasional UMKM, mencari co-marketing partner.",
      tags: ["Automation", "B2B", "AI-lite"],
    },
    {
      type: "company",
      name: "Batik Kreativa",
      industry: "Ritel",
      location: "Yogyakarta",
      rating: 4.2,
      needs: ["Distribusi", "Operasional"],
      competencies: ["Negosiasi", "Komunikasi"],
      pitch: "Mitra logistik e-commerce untuk pengiriman nasional.",
      tags: ["E-commerce", "Local Craft"],
    },
    {
      type: "company",
      name: "FinLite",
      industry: "Keuangan",
      location: "Jakarta",
      rating: 4.1,
      needs: ["Teknologi", "Operasional"],
      competencies: ["Analisis Data", "Leadership"],
      pitch: "Solusi micro-lending, kolaborasi untuk KYC & scoring.",
      tags: ["Fintech", "Scoring"],
    },
    {
      type: "company",
      name: "RantaiLog",
      industry: "Logistik",
      location: "Surabaya",
      rating: 4.0,
      needs: ["Teknologi", "Pemasaran"],
      competencies: ["Manajemen Proyek", "Negosiasi"],
      pitch: "Optimasi cold chain, butuh integrasi IoT & partner co-sales.",
      tags: ["Cold Chain", "IoT"],
    },
    {
      type: "company",
      name: "Studio Cipta",
      industry: "Kreatif",
      location: "Bali",
      rating: 4.7,
      needs: ["Pemasaran", "Pendanaan"],
      competencies: ["Design Thinking", "Komunikasi"],
      pitch: "Agensi kreatif untuk hospitality, mencari investor & channel.",
      tags: ["Branding", "Hospitality"],
    },
    {
      type: "person",
      name: "Andi Pratama",
      role: "Growth Marketer",
      industry: "Teknologi",
      location: "Bandung",
      rating: 4.8,
      needs: ["SEO", "Paid Ads"],
      competencies: ["Pemasaran Digital", "Komunikasi"],
      pitch: "Kolaborasi kampanye akuisisi pengguna untuk produk SaaS.",
      tags: ["Lifecycle"],
    },
    {
      type: "person",
      name: "Ayu Pratiwi",
      role: "Growth Marketer",
      industry: "Teknologi",
      location: "Jakarta",
      rating: 4.6,
      needs: ["Pemasaran", "Pendanaan"],
      competencies: ["Pemasaran Digital", "Komunikasi"],
      pitch: "Tertarik kolaborasi kampanye akuisisi pengguna untuk produk SaaS.",
      tags: ["SEO", "Paid Ads", "Lifecycle"],
    },
    {
      type: "person",
      name: "Budi Santoso",
      role: "Full-stack Developer",
      industry: "Teknologi",
      location: "Bandung",
      rating: 4.5,
      needs: ["Teknologi", "Operasional"],
      competencies: ["Pengembangan Web", "Analisis Data", "Manajemen Proyek"],
      pitch: "Membantu membangun MVP cepat untuk validasi pasar.",
      tags: ["Node.js", "React", "MVP"],
    },
    {
      type: "person",
      name: "Sari Lestari",
      role: "UX Researcher",
      industry: "Kreatif",
      location: "Yogyakarta",
      rating: 4.4,
      needs: ["Riset Pengguna", "Operasional"],
      competencies: ["Design Thinking", "Komunikasi"],
      pitch: "Kolaborasi riset pengguna untuk meningkatkan konversi produk digital.",
      tags: ["User Interview", "Usability", "Persona"],
    },
  ]

  // ====== Eksplor — Filter & Render ======
  const resultsEl = $("#results")
  const resultsCountEl = $("#results-count")

  function renderPartnerCard(p) {
    const initials = p.name
      .split(" ")
      .map((s) => s[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
    const compChips = (p.competencies || []).map((t) => `<span class="chip chip--cap">${t}</span>`).join("")
    const needsChips = (p.needs || []).map((t) => `<span class="chip chip--need">${t}</span>`).join("")
    const comp = (p.competencies || []).join(" • ")
    const isPerson = p.type === "person"
    const badge = isPerson
      ? `<span class="badge badge--person">Orang</span>`
      : `<span class="badge badge--company">Perusahaan</span>`
    const rating = typeof p.rating === "number" ? ` • <span aria-label="rating">★ ${p.rating.toFixed(1)}</span>` : ""
    const headline = `${p.name} ${badge}`
    const metaTop = isPerson
      ? `${p.role || "Profesional"} • ${p.industry} • ${p.location}${rating}`
      : `${p.industry} • ${p.location}${rating}`

    return `
      <article class="card partner">
        <div class="avatar" aria-hidden="true">${initials}</div>
        <div>
          <h3 style="margin:0; display:flex; align-items:center; gap:.25rem; flex-wrap:wrap">${headline}</h3>
          <div class="meta muted">${metaTop}</div>
          ${!isPerson ? `<div class="meta muted">Kompetensi: ${comp}</div>` : `<div class="meta muted">Kebutuhan: ${(p.needs || []).join(", ")}</div>`}
          <p style="margin:.35rem 0 0">${p.pitch || ""}</p>
          <div class="chips" aria-label="Kompetensi">${compChips}</div>
          <div class="chips" aria-label="Kebutuhan">${needsChips}</div>
        </div>
      </article>
    `
  }

  function applyFilters() {
    const typeVal = $("#filter-type").value.trim()
    const ind = $("#filter-industry").value.trim()
    const loc = $("#filter-location").value.trim()
    const need = $("#filter-needs").value.trim()
    const skill = $("#filter-skill").value.trim()
    const q = $("#filter-search").value.trim().toLowerCase()

    const filtered = partners.filter((p) => {
      const byType = !typeVal || p.type === typeVal
      const byInd = !ind || p.industry === ind
      const byLoc = !loc || p.location === loc
      const byNeed = !need || (Array.isArray(p.needs) && p.needs.includes(need))
      const bySkill = !skill || (Array.isArray(p.competencies) && p.competencies.includes(skill))
      const byQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.role && p.role.toLowerCase().includes(q)) ||
        p.pitch.toLowerCase().includes(q) ||
        (Array.isArray(p.tags) && p.tags.some((t) => t.toLowerCase().includes(q)))
      return byType && byInd && byLoc && byNeed && bySkill && byQuery
    })

    resultsEl.setAttribute("aria-busy", "true")
    resultsEl.innerHTML =
      filtered.map(renderPartnerCard).join("") || `<div class="card">Tidak ada hasil yang cocok.</div>`
    resultsEl.setAttribute("aria-busy", "false")
    resultsCountEl.textContent = `${filtered.length} hasil`
  }

  $$("#filters select, #filters input").forEach((el) => el.addEventListener("input", applyFilters))
  $("#filters-clear").addEventListener("click", () => {
    $$("#filters select").forEach((s) => (s.value = ""))
    $("#filter-search").value = ""
    applyFilters()
  })

  // Inisialisasi hasil awal
  resultsEl.innerHTML = partners.map(renderPartnerCard).join("")
  resultsCountEl.textContent = `${partners.length} hasil`

  // ====== Wizard Setup Profil ======
  const stepsTotal = 5
  let step = 1

  const progressBar = $("#progress-bar")
  const prevBtn = $("#prev-step")
  const nextBtn = $("#next-step")
  const saveBtn = $("#save-profile")

  const hardPoolEl = $("#hard-skill-pool")
  const softPoolEl = $("#soft-skill-pool")
  const hardSelEl = $("#hard-skill-selected")
  const softSelEl = $("#soft-skill-selected")
  const competencyListEl = $("#competency-list")
  const previewEl = $("#preview")

  const defaultHard = [
    "Operasional",
    "Keuangan",
    "Pengembangan Produk",
    "Manajemen Proyek",
    "Analisis Data",
    "Pengembangan Web",
  ]
  const defaultSoft = ["Leadership", "Komunikasi", "Negosiasi", "Kolaborasi", "Pemecahan Masalah", "Adaptabilitas"]
  const defaultCompetency = [
    "Leadership",
    "Komunikasi",
    "Negosiasi",
    "Manajemen Proyek",
    "Pemasaran Digital",
    "Analisis Data",
    "Design Thinking",
  ]

  let state = {
    biz: {
      name: "",
      industry: "",
      location: "",
      website: "",
      description: "",
      pitch: "",
    },
    hardSkills: new Set(),
    softSkills: new Set(),
    competencies: {}, // { name: level }
  }

  function updateProgress() {
    const pct = (step / stepsTotal) * 100
    progressBar.style.width = `${pct}%`
    prevBtn.disabled = step === 1
    nextBtn.textContent = step === stepsTotal ? "Selesai" : "Berikutnya"
    if (step === stepsTotal) nextBtn.setAttribute("aria-label", "Selesai")
  }

  function showStep(n) {
    step = n
    $$(".step").forEach((fs) => {
      const s = Number(fs.dataset.step)
      fs.hidden = s !== n
    })
    // Refresh dynamic sections
    if (step === 3) renderSkillPools()
    if (step === 4) renderCompetencies()
    if (step === 5) renderPreview()
    updateProgress()
  }

  function ensureNonEmpty(val) {
    return (val || "").trim().length > 0
  }

  function validateStep(n) {
    if (n === 1) {
      const name = $("#biz-name").value
      const ind = $("#biz-industry").value
      const loc = $("#biz-location").value
      const desc = $("#biz-description").value
      return ensureNonEmpty(name) && ensureNonEmpty(ind) && ensureNonEmpty(loc) && ensureNonEmpty(desc)
    }
    return true
  }

  prevBtn.addEventListener("click", () => {
    if (step > 1) showStep(step - 1)
  })

  nextBtn.addEventListener("click", () => {
    if (!validateStep(step)) {
      alert("Mohon lengkapi kolom yang wajib di Step ini.")
      return
    }
    // Persist current step input to state
    if (step === 1) {
      state.biz.name = $("#biz-name").value.trim()
      state.biz.industry = $("#biz-industry").value.trim()
      state.biz.location = $("#biz-location").value.trim()
      state.biz.website = $("#biz-website").value.trim()
      state.biz.description = $("#biz-description").value.trim()
    }
    if (step === 2) {
      state.biz.pitch = $("#biz-pitch").value.trim()
    }
    if (step < stepsTotal) showStep(step + 1)
  })

  // Skills rendering / selection
  function tagHtml(label, selected = false) {
    const cls = ["btn", "skill"]
    if (selected) cls.push("selected")
    return `<button type="button" class="${cls.join(" ")}" data-skill="${label}">${label}</button>`
  }

  function renderSkillPools() {
    // render pool
    hardPoolEl.innerHTML = defaultHard.map((s) => tagHtml(s, state.hardSkills.has(s))).join("")
    softPoolEl.innerHTML = defaultSoft.map((s) => tagHtml(s, state.softSkills.has(s))).join("")
    // render selected
    hardSelEl.innerHTML =
      Array.from(state.hardSkills)
        .map((s) => tagHtml(s, true))
        .join("") || `<span class="muted">Belum ada</span>`
    softSelEl.innerHTML =
      Array.from(state.softSkills)
        .map((s) => tagHtml(s, true))
        .join("") || `<span class="muted">Belum ada</span>`

    // toggle behavior
    $$("#hard-skill-pool .skill").forEach((btn) => {
      btn.onclick = () => {
        const s = btn.dataset.skill
        if (state.hardSkills.has(s)) state.hardSkills.delete(s)
        else state.hardSkills.add(s)
        renderSkillPools()
      }
    })
    $$("#soft-skill-pool .skill").forEach((btn) => {
      btn.onclick = () => {
        const s = btn.dataset.skill
        if (state.softSkills.has(s)) state.softSkills.delete(s)
        else state.softSkills.add(s)
        renderSkillPools()
      }
    })
    $$("#hard-skill-selected .skill").forEach((btn) => {
      btn.onclick = () => {
        state.hardSkills.delete(btn.dataset.skill)
        renderSkillPools()
      }
    })
    $$("#soft-skill-selected .skill").forEach((btn) => {
      btn.onclick = () => {
        state.softSkills.delete(btn.dataset.skill)
        renderSkillPools()
      }
    })
  }

  $("#add-hard-skill").addEventListener("click", () => {
    const val = $("#hard-skill-input").value.trim()
    if (!val) return
    state.hardSkills.add(val)
    $("#hard-skill-input").value = ""
    renderSkillPools()
  })
  $("#add-soft-skill").addEventListener("click", () => {
    const val = $("#soft-skill-input").value.trim()
    if (!val) return
    state.softSkills.add(val)
    $("#soft-skill-input").value = ""
    renderSkillPools()
  })

  // Competencies
  function renderCompetencies() {
    // If empty, seed defaults with 60 level
    if (Object.keys(state.competencies).length === 0) {
      defaultCompetency.forEach((c) => (state.competencies[c] = 60))
    }
    competencyListEl.innerHTML = Object.entries(state.competencies)
      .map(([name, val]) => {
        const v = Number(val)
        return `
          <div class="comp-row">
            <label>
              <span>${name}</span>
              <span class="val">${v}</span>
            </label>
            <input type="range" min="0" max="100" value="${v}" data-name="${name}" aria-label="${name}" />
          </div>
        `
      })
      .join("")

    // bind range updates
    $$('#competency-list input[type="range"]').forEach((r) => {
      r.oninput = () => {
        const v = Number(r.value)
        const name = r.dataset.name
        state.competencies[name] = v
        r.previousElementSibling.querySelector(".val").textContent = v
      }
    })
  }

  // Preview
  function renderPreview() {
    const hs = Array.from(state.hardSkills)
    const ss = Array.from(state.softSkills)
    const comp = Object.entries(state.competencies)
      .map(([k, v]) => `<span class="pill"><b>${k}</b> ${v}</span>`)
      .join(" ")

    previewEl.innerHTML = `
      <h3>${state.biz.name || "Nama Usaha"}</h3>
      <div class="meta muted">
        ${state.biz.industry || "Industri"} • ${state.biz.location || "Lokasi"} ${state.biz.website ? `• <a href="${state.biz.website}" target="_blank" rel="noopener">Website</a>` : ""}
      </div>
      <p style="margin:.35rem 0 0">${state.biz.description || "Deskripsi singkat bisnis Anda akan tampil di sini."}</p>
      <div style="margin-top:.5rem">
        <strong>Pitch:</strong>
        <p style="margin:.25rem 0 0">${state.biz.pitch || "Pitch Anda akan tampil di sini."}</p>
      </div>
      <div class="grid" style="margin-top:.75rem; gap:.5rem">
        <div>
          <strong>Hard Skill:</strong>
          <div class="tags" style="margin-top:.25rem">${hs.map((s) => `<span class="tag">${s}</span>`).join("") || `<span class="muted">-</span>`}</div>
        </div>
        <div>
          <strong>Soft Skill:</strong>
          <div class="tags" style="margin-top:.25rem">${ss.map((s) => `<span class="tag">${s}</span>`).join("") || `<span class="muted">-</span>`}</div>
        </div>
      </div>
      <div style="margin-top:.75rem">
        <strong>Kompetensi & Level:</strong>
        <div class="tags" style="margin-top:.25rem">${comp || `<span class="muted">-</span>`}</div>
      </div>
    `
  }

  // Save profile
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      try {
        // Final capture if user edited last step fields earlier
        localStorage.setItem(
          "collabify_profile",
          JSON.stringify({
            ...state,
            biz: {
              ...state.biz,
              name: $("#biz-name").value.trim() || state.biz.name,
              industry: $("#biz-industry").value.trim() || state.biz.industry,
              location: $("#biz-location").value.trim() || state.biz.location,
              website: $("#biz-website").value.trim() || state.biz.website,
              description: $("#biz-description").value.trim() || state.biz.description,
              pitch: $("#biz-pitch").value.trim() || state.biz.pitch,
            },
          }),
        )
        alert("Profil tersimpan di perangkat Anda.")
      } catch (e) {
        alert("Gagal menyimpan profil. Coba lagi.")
      }
    })
  }

  // Load saved profile
  function loadSaved() {
    const raw = localStorage.getItem("collabify_profile")
    if (!raw) return
    try {
      const saved = JSON.parse(raw)
      state = {
        biz: saved.biz || state.biz,
        hardSkills: new Set(saved.hardSkills ? Array.from(saved.hardSkills) : Array.from(state.hardSkills)),
        softSkills: new Set(saved.softSkills ? Array.from(saved.softSkills) : Array.from(state.softSkills)),
        competencies: saved.competencies || state.competencies,
      }
      // Fill form
      $("#biz-name").value = state.biz.name || ""
      $("#biz-industry").value = state.biz.industry || ""
      $("#biz-location").value = state.biz.location || ""
      $("#biz-website").value = state.biz.website || ""
      $("#biz-description").value = state.biz.description || ""
      $("#biz-pitch").value = state.biz.pitch || ""
    } catch {}
  }
  loadSaved()

  // Init skill pools once user reaches step 3
  // Init progress & step
  showStep(1)

  // Footer year
  $("#year").textContent = String(new Date().getFullYear())
})()
