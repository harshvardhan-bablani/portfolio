import { FormEvent, MouseEvent, useEffect, useRef, useState } from "react"

// Add real profile URLs here; empty values render honestly as "ready to configure".
const LINKS = {
  github: "https://github.com/harshvardhan-bablani",
  linkedin: "https://www.linkedin.com/in/harshvardhan-bablani-865688303/",
  email: "harshvardhanbablani@gmail.com",
  resume: "",
}

const navItems = [
  ["01", "About", "about"],
  ["02", "Projects", "projects"],
  ["03", "Skills", "skills"],
  ["04", "Achievements", "achievements"],
  ["05", "Contact", "contact"],
]

const projects = [
  {
    id: "PROC_001",
    status: "COMPLETE",
    title: "Binary Chess Engine",
    stack: "C++17 / BITBOARDS / ALPHA-BETA / UCI",
    description:
      "A complete chess engine built from first principles: 64-bit bitboards, full legal move generation, alpha-beta search with iterative deepening, piece-square evaluation, and a UCI interface that plays at roughly 1500 Elo.",
    signal: "Systems & search",
    url: "https://github.com/harshvardhan-bablani/Binary-Chess-Engine",
  },
  {
    id: "PROC_002",
    status: "SUBMITTED",
    title: "Advent of FPGA — Secret Entrance",
    stack: "HARDCAML / RTL / FPGA / VERIFICATION",
    description:
      "A hardware RTL solution to Advent of Code 2025 Day 1 for the Jane Street FPGA Challenge. A clocked datapath models the safe dial click by click, counting every zero crossing, and is verified against the official example.",
    signal: "Jane Street FPGA Challenge",
    url: "https://github.com/harshvardhan-bablani/Jane-Street-Advent-Of-FPGA",
  },
]

const skillGroups = [
  ["LANGUAGES", ["C++", "Python", "C"]],
  [
    "CORE CS",
    [
      "Data structures & algorithms",
      "OOP",
      "Computer architecture",
      "Competitive programming",
    ],
  ],
  ["SYSTEMS", ["Linux", "Git & GitHub", "GCC / g++", "Hardcaml / RTL"]],
  [
    "QUANT",
    [
      "NumPy",
      "pandas",
      "Probability & statistics",
      "Linear algebra",
      "Backtesting",
      "Financial data analysis",
    ],
  ],
]

function MatrixRain({ intense }: { intense: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (!canvas || !context) return
    let frame = 0
    let animation = 0
    let columns: number[] = []
    const fontSize = 16
    const glyphs = "01<>[]{}:/\\*+-=CPP"
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = window.innerWidth * ratio
      canvas.height = window.innerHeight * ratio
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      columns = Array(Math.ceil(window.innerWidth / fontSize)).fill(0)
    }
    const draw = () => {
      frame += 1
      if (frame % (intense ? 2 : 3) === 0) {
        context.fillStyle = intense
          ? "rgba(1, 12, 7, .12)"
          : "rgba(1, 8, 5, .17)"
        context.fillRect(0, 0, window.innerWidth, window.innerHeight)
        context.font = `${fontSize}px "IBM Plex Mono", monospace`
        columns.forEach((drop, index) => {
          if (Math.random() > (intense ? 0.35 : 0.68)) return
          context.fillStyle =
            Math.random() > 0.96 ? "#d8ffe8" : intense ? "#5cff8d" : "#1d7d45"
          context.fillText(
            glyphs[Math.floor(Math.random() * glyphs.length)],
            index * fontSize,
            drop * fontSize,
          )
          if (drop * fontSize > window.innerHeight && Math.random() > 0.98)
            columns[index] = 0
          else columns[index] += 1
        })
      }
      animation = requestAnimationFrame(draw)
    }
    resize()
    window.addEventListener("resize", resize)
    if (!reduced) draw()
    return () => {
      cancelAnimationFrame(animation)
      window.removeEventListener("resize", resize)
    }
  }, [intense])

  return <canvas ref={canvasRef} className="matrix-rain" aria-hidden="true" />
}

function ScrambleText({ children }: { children: string }) {
  const [value, setValue] = useState(children)
  const intervalRef = useRef<number | undefined>(undefined)
  const scramble = () => {
    window.clearInterval(intervalRef.current)
    let iteration = 0
    const chars = "01_<>/{}"
    intervalRef.current = window.setInterval(() => {
      setValue(
        children
          .split("")
          .map((letter, index) =>
            index < iteration || letter === " "
              ? letter
              : chars[Math.floor(Math.random() * chars.length)],
          )
          .join(""),
      )
      iteration += 0.65
      if (iteration >= children.length) {
        window.clearInterval(intervalRef.current)
        setValue(children)
      }
    }, 28)
  }
  useEffect(() => () => window.clearInterval(intervalRef.current), [])
  return <span onMouseEnter={scramble}>{value}</span>
}

function Terminal() {
  const [command, setCommand] = useState("")
  const [history, setHistory] = useState([
    "HARSH_OS terminal initialized.",
    'Type "help" to inspect available commands.',
  ])
  const execute = (event: FormEvent) => {
    event.preventDefault()
    const input = command.trim().toLowerCase()
    if (!input) return
    const responses: Record<string, string> = {
      help: "COMMANDS: about, skills, projects, achievements, whoami, matrix, clear",
      about:
        "C++ developer + CS student. Builds with rigor; learns by solving.",
      skills:
        "C++ | algorithms | systems | Python | competitive programming | quant",
      projects:
        "2 processes found: binary_chess_engine, advent_of_fpga. Scroll to /SYS/PROCESSES.",
      achievements:
        "IMC Prosperity 4: 726/30,706 | Huawei ICPC Online Challenge 2026: 379/~34,000 | Codeforces peak: 1202",
      whoami: "visitor@harsh-os — curious operator with terminal access",
      matrix: "Wake up, operator. Hidden render mode unlocked.",
    }
    if (input === "clear") setHistory([])
    else
      setHistory((current) => [
        ...current,
        `visitor $ ${command}`,
        responses[input] || `command not found: ${input}`,
      ])
    if (input === "matrix") window.dispatchEvent(new Event("matrix-mode"))
    setCommand("")
  }
  return (
    <div className="terminal" aria-label="Interactive terminal">
      <div className="terminal-bar">
        <span>SYS://INTERFACE/TERMINAL</span>
        <span className="terminal-lights" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </div>
      <div className="terminal-output" aria-live="polite">
        {history.map((line, index) => (
          <p
            key={`${line}-${index}`}
            className={line.startsWith("visitor") ? "command-line" : ""}
          >
            {line}
          </p>
        ))}
      </div>
      <form onSubmit={execute} className="terminal-input">
        <label htmlFor="command">visitor $</label>
        <input
          id="command"
          value={command}
          onChange={(event) => setCommand(event.target.value)}
          autoComplete="off"
          spellCheck="false"
          aria-label="Enter a terminal command"
        />
        <span className="block-cursor" aria-hidden="true" />
      </form>
    </div>
  )
}

function ConfigurableLink({
  type,
  label,
  detail,
}: {
  type: keyof typeof LINKS
  label: string
  detail: string
}) {
  const href =
    type === "email" && LINKS[type] ? `mailto:${LINKS[type]}` : LINKS[type]
  const content = (
    <>
      <span className="contact-index">
        0{Object.keys(LINKS).indexOf(type) + 1}
      </span>
      <span>
        <strong>{label}</strong>
        <small>{href ? detail : "LINK READY TO CONFIGURE"}</small>
      </span>
      <b aria-hidden="true">{href ? "↗" : "+"}</b>
    </>
  )
  return href ? (
    <a
      className="contact-link"
      href={href}
      target={type === "email" ? undefined : "_blank"}
      rel="noreferrer"
    >
      {content}
    </a>
  ) : (
    <div
      className="contact-link is-unset"
      title="Add this URL in the LINKS object in App.tsx"
    >
      {content}
    </div>
  )
}

export default function App() {
  const [active, setActive] = useState("about")
  const [menuOpen, setMenuOpen] = useState(false)
  const [matrixMode, setMatrixMode] = useState(false)
  const [burst, setBurst] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const sections = navItems
      .map(([, , id]) => document.getElementById(id))
      .filter((item): item is HTMLElement => Boolean(item))
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting)
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: "-35% 0px -50%" },
    )
    sections.forEach((section) => observer.observe(section))
    const sequence = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "b",
      "a",
    ]
    let position = 0
    const keyHandler = (event: KeyboardEvent) => {
      position = event.key === sequence[position] ? position + 1 : 0
      if (position === sequence.length) {
        setMatrixMode((value) => !value)
        position = 0
      }
    }
    const matrixHandler = () => setMatrixMode(true)
    window.addEventListener("keydown", keyHandler)
    window.addEventListener("matrix-mode", matrixHandler)
    return () => {
      observer.disconnect()
      window.removeEventListener("keydown", keyHandler)
      window.removeEventListener("matrix-mode", matrixHandler)
    }
  }, [])

  const navigate = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    setMenuOpen(false)
  }
  const createBurst = (event: MouseEvent) => {
    setBurst({ x: event.clientX, y: event.clientY })
    window.setTimeout(() => setBurst(null), 650)
  }

  return (
    <div
      className={`app-shell ${matrixMode ? "matrix-mode" : ""}`}
      onClick={createBurst}
    >
      <MatrixRain intense={matrixMode} />
      <div className="noise" aria-hidden="true" />
      {burst && (
        <span
          className="particle-burst"
          style={{ left: burst.x, top: burst.y }}
          aria-hidden="true"
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <i key={index} style={{ "--i": index } as React.CSSProperties} />
          ))}
        </span>
      )}

      <header className="mobile-header">
        <button
          className="brand-button"
          onClick={() => navigate("home")}
          aria-label="Go to top"
        >
          HB<span>_</span>
        </button>
        <span>HARSH_OS / PORTFOLIO</span>
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
        >
          {menuOpen ? "CLOSE" : "MENU"}
        </button>
      </header>
      <aside className={`system-rail ${menuOpen ? "is-open" : ""}`}>
        <button
          className="brand-button desktop-brand"
          onClick={() => navigate("home")}
          aria-label="Go to top"
        >
          HB<span>_</span>
        </button>
        <div className="rail-meta">
          <span>PORTFOLIO_SYS</span>
          <span>V.2026.01</span>
        </div>
        <nav aria-label="Primary navigation">
          {navItems.map(([number, label, id]) => (
            <button
              key={id}
              className={active === id ? "active" : ""}
              onClick={() => navigate(id)}
            >
              <span>{number}</span>
              {label}
            </button>
          ))}
        </nav>
        <div className="rail-status">
          <span className="pulse" />
          SYSTEM ONLINE<small>LOCAL TIME / IST</small>
        </div>
      </aside>

      <main>
        <section id="home" className="hero panel-grid">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="status-dot" /> AVAILABLE FOR INTERESTING PROBLEMS
            </div>
            <p className="boot-line">[BOOT SEQUENCE COMPLETE]</p>
            <h1>
              HARSHVARDHAN
              <br />
              <ScrambleText>BABLANI</ScrambleText>
            </h1>
            <p className="hero-role">
              C++ DEVELOPER <span>//</span> CS STUDENT <span>//</span> PROBLEM
              SOLVER
            </p>
            <blockquote className="hero-quote">
              <p>
                <span aria-hidden="true">“</span>Engineering Systems Where
                Performance Matters.
              </p>
            </blockquote>
            <div className="hero-actions">
              <button
                className="primary-action"
                onClick={() => navigate("projects")}
              >
                EXECUTE: VIEW_WORK <span>→</span>
              </button>
              <button
                className="text-action"
                onClick={() => navigate("contact")}
              >
                ./open_contact
              </button>
            </div>
          </div>
          <div
            className="hero-visual"
            aria-label="C plus plus code visualization"
          >
            <div className="orbital orbit-one" />
            <div className="orbital orbit-two" />
            <div className="cpp-mark">
              C<span>++</span>
            </div>
            <div className="code-fragment fragment-one">
              while (curious) {"{"} learn(); {"}"}
            </div>
            <div className="code-fragment fragment-two">O(log n)</div>
            <div className="code-fragment fragment-three">0x48 0x42</div>
            <div className="visual-caption">CORE_PROCESS::RUNNING</div>
          </div>
          <div className="scroll-cue">
            SCROLL TO EXPLORE <span>↓</span>
          </div>
        </section>

        <section id="about" className="content-section">
          <div className="section-label">
            <span>01</span>
            <p>/USER/ABOUT</p>
          </div>
          <div className="section-content about-grid">
            <div>
              <p className="kicker">IDENTITY.LOG</p>
              <h2>ENGINEERING, FROM FIRST PRINCIPLES.</h2>
            </div>
            <div className="about-copy">
              <p>
                I’m a computer science student and software developer focused on{" "}
                <strong>C++</strong>, algorithms, and systems-level
                problem-solving. I build with an emphasis on performance,
                correctness, and maintainable code—turning technical
                requirements into practical, reliable solutions.
              </p>
              <p>
                My experience spans competitive programming, hands-on software
                projects, and open-source contributions. I also work with Python
                for data-driven and quantitative projects, applying the same
                engineering discipline to analysis, implementation, and testing.
              </p>
              <p>
                I value clear reasoning, attention to detail, and software that
                does what it’s supposed to do—not just in theory, but in
                practice.
              </p>
              <div className="principles">
                <div>
                  <span>01</span>
                  <strong>CORRECTNESS</strong>
                  <small>Make it work.</small>
                </div>
                <div>
                  <span>02</span>
                  <strong>CLARITY</strong>
                  <small>Make it legible.</small>
                </div>
                <div>
                  <span>03</span>
                  <strong>EFFICIENCY</strong>
                  <small>Make it scale.</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="content-section">
          <div className="section-label">
            <span>02</span>
            <p>/SYS/PROCESSES</p>
          </div>
          <div className="section-content">
            <div className="section-heading">
              <div>
                <p className="kicker">SELECTED WORK</p>
                <h2>ACTIVE PROCESSES</h2>
              </div>
              <p>{String(projects.length).padStart(2, "0")} processes found</p>
            </div>
            <div className="project-list">
              {projects.map((project, index) => (
                <article className="project-card" key={project.id}>
                  <a
                    className="project-hit"
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${project.title} on GitHub`}
                  />
                  <div className="project-top">
                    <span>{project.id}</span>
                    <span className="project-status">
                      <i /> {project.status}
                    </span>
                  </div>
                  <div className="project-number">0{index + 1}</div>
                  <div className="project-body">
                    <p>{project.signal}</p>
                    <h3>{project.title}</h3>
                    <p className="project-description">{project.description}</p>
                    <div className="project-meta">
                      <div className="stack">{project.stack}</div>
                      <span className="project-open">VIEW ON GITHUB ↗</span>
                    </div>
                  </div>
                  <div className="project-arrow" aria-hidden="true">
                    ↗
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="skills" className="content-section">
          <div className="section-label">
            <span>03</span>
            <p>/USR/SKILLS</p>
          </div>
          <div className="section-content skills-layout">
            <div className="skills-copy">
              <p className="kicker">CAPABILITY MAP</p>
              <h2>
                TOOLS ARE SECONDARY.
                <br />
                THINKING IS THE ENGINE.
              </h2>
              <p>
                A developing toolkit built around a stable core: computational
                thinking and persistence.
              </p>
            </div>
            <div className="skill-terminal">
              <div className="skill-terminal-head">
                <span>capabilities.json</span>
                <span>READ ONLY</span>
              </div>
              {skillGroups.map(([group, skills]) => (
                <div className="skill-row" key={group as string}>
                  <span className="skill-group">{group as string}</span>
                  <div>
                    {(skills as string[]).map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="achievements" className="content-section">
          <div className="section-label">
            <span>04</span>
            <p>/VAR/ACHIEVEMENTS</p>
          </div>
          <div className="section-content">
            <div className="section-heading">
              <div>
                <p className="kicker">VALIDATED OUTPUT</p>
                <h2>LEADERBOARD SIGNALS</h2>
              </div>
              <p>Results, not decoration.</p>
            </div>
            <div className="achievement-grid">
              <article>
                <div className="achievement-code">IMC:P4</div>
                <p>TRADING CHALLENGE</p>
                <h3>IMC Prosperity 4</h3>
                <div className="rank">
                  <strong>726</strong>
                  <span>/ 30,706</span>
                </div>
                <div className="rank-line">
                  <i style={{ width: "97.6%" }} />
                </div>
                <small>TOP 2.4% OF PARTICIPANTS</small>
              </article>
              <article>
                <div className="achievement-code">ICPC:26</div>
                <p>ONLINE CHALLENGE BY HUAWEI</p>
                <h3>ICPC Online Challenge 2026</h3>
                <div className="rank">
                  <strong>379</strong>
                  <span>/ ~34,000</span>
                </div>
                <div className="rank-line">
                  <i style={{ width: "98.9%" }} />
                </div>
                <small>APPROX. TOP 1.1% OF PARTICIPANTS</small>
              </article>
              <article className="achievement-wide">
                <div className="achievement-code">CF:1202</div>
                <p>COMPETITIVE PROGRAMMING</p>
                <h3>Codeforces</h3>
                <div className="rank">
                  <strong>1202</strong>
                  <span>PEAK RATING</span>
                </div>
                <div className="rank-line">
                  <i style={{ width: "50%" }} />
                </div>
                <small>RATING SCALE / 2400 &middot; PUPIL TIER</small>
              </article>
            </div>
          </div>
        </section>

        <section
          className="content-section terminal-section"
          aria-label="Playground"
        >
          <div className="section-label">
            <span>05</span>
            <p>/DEV/PLAYGROUND</p>
          </div>
          <div className="section-content">
            <Terminal />
            <p className="easter-hint">
              Psst — old game codes still work here.
            </p>
          </div>
        </section>

        <section id="contact" className="content-section contact-section">
          <div className="section-label">
            <span>06</span>
            <p>/NET/CONNECT</p>
          </div>
          <div className="section-content contact-grid">
            <div>
              <p className="kicker">OPEN CHANNEL</p>
              <h2>HAVE A HARD PROBLEM?</h2>
              <p>
                I’m always open to thoughtful conversations about software,
                algorithms, systems, and quantitative ideas.
              </p>
            </div>
            <div className="contact-links">
              <ConfigurableLink
                type="github"
                label="GITHUB"
                detail="VIEW SOURCE & SOLUTIONS"
              />
              <ConfigurableLink
                type="linkedin"
                label="LINKEDIN"
                detail="PROFESSIONAL NETWORK"
              />
              <ConfigurableLink
                type="email"
                label="EMAIL"
                detail="SEND A MESSAGE"
              />
              <ConfigurableLink
                type="resume"
                label="RESUME"
                detail="DOWNLOAD PDF"
              />
            </div>
          </div>
        </section>
        <footer>
          <p>DESIGNED & ENGINEERED FOR THE WEB</p>
          <p>HARSHVARDHAN BABLANI © 2026</p>
          <button onClick={() => navigate("home")}>RETURN_TO_TOP ↑</button>
        </footer>
      </main>
    </div>
  )
}
