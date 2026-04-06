import React from 'react';
import { motion } from 'framer-motion';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const velocityData = [
  { name: 'S1', planned: 40, actual: 35 },
  { name: 'S2', planned: 45, actual: 42 },
  { name: 'S3', planned: 42, actual: 48 },
  { name: 'S4', planned: 44, actual: 43 },
];

const burndownData = [
  { day: 'D1',  ideal: 100, actual: 100 },
  { day: 'D3',  ideal: 85,  actual: 88  },
  { day: 'D5',  ideal: 70,  actual: 72  },
  { day: 'D7',  ideal: 55,  actual: 58  },
  { day: 'D9',  ideal: 40,  actual: 43  },
  { day: 'D11', ideal: 25,  actual: 31  },
  { day: 'D13', ideal: 10,  actual: 18  },
];

const teams = [
  { name: 'Team Alpha', progress: 85, color: 'linear-gradient(90deg,#1B6BF5,#4D9EFF)' },
  { name: 'Team Beta',  progress: 62, color: 'linear-gradient(90deg,#0ABFBC,#5DDBD9)' },
  { name: 'Team Gamma', progress: 45, color: 'linear-gradient(90deg,#F39C12,#F6BC5C)' },
];

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, trend, trendUp, iconBg, iconColor, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    style={{
      background: 'rgba(255,255,255,0.055)',
      border: '1px solid rgba(255,255,255,0.10)',
      backdropFilter: 'blur(28px)',
      WebkitBackdropFilter: 'blur(28px)',
      borderRadius: 20,
      padding: '26px 24px',
      position: 'relative',
      overflow: 'hidden',
      cursor: 'default',
      boxShadow: '0 4px 30px rgba(0,0,0,0.22)',
    }}
  >
    {/* Sheen */}
    <div style={{
      position: 'absolute', inset: 0, borderRadius: 20,
      background: 'linear-gradient(135deg,rgba(255,255,255,0.06) 0%,transparent 55%)',
      pointerEvents: 'none',
    }} />

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
      <div style={{
        width: 44, height: 44, borderRadius: 13,
        background: iconBg, color: iconColor,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 19,
      }}>
        {icon}
      </div>
      <div style={{
        fontFamily: "'Outfit', sans-serif",
        fontSize: 11, fontWeight: 600, letterSpacing: '0.04em',
        color: trendUp ? '#34D399' : '#F87171',
        background: trendUp ? 'rgba(52,211,153,0.12)' : 'rgba(248,113,113,0.12)',
        padding: '4px 11px', borderRadius: 20,
        display: 'flex', alignItems: 'center', gap: 3,
      }}>
        {trendUp ? '↑' : '↓'} {trend}
      </div>
    </div>

    <div style={{
      fontFamily: "'Outfit', sans-serif",
      fontSize: 10.5, fontWeight: 500,
      color: 'rgba(232,235,244,0.38)',
      textTransform: 'uppercase', letterSpacing: '0.14em',
      marginBottom: 10,
    }}>
      {label}
    </div>

    {/* Value in Playfair Display italic — editorial & classy */}
    <div style={{
      fontFamily: "'Playfair Display', serif",
      fontSize: 40, fontWeight: 700,
      fontStyle: 'italic',
      color: '#fff', lineHeight: 1,
      letterSpacing: '-0.5px',
    }}>
      {value}
    </div>
  </motion.div>
);

// ─── Burndown SVG Chart ───────────────────────────────────────────────────────
const BurndownChart = () => {
  const W = 480, H = 200, padL = 8, padR = 12, padT = 8, padB = 28;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const n = burndownData.length;
  const px = (i) => padL + (i / (n - 1)) * chartW;
  const py = (v) => padT + (1 - v / 100) * chartH;
  const idealPts = burndownData.map((d, i) => `${px(i)},${py(d.ideal)}`).join(' ');
  const actualPts = burndownData.map((d, i) => `${px(i)},${py(d.actual)}`).join(' ');
  const areaPath = `${px(0)},${py(0)} ${actualPts} ${px(n - 1)},${padT + chartH}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 200 }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0ABFBC" stopOpacity={0.22} />
          <stop offset="100%" stopColor="#0ABFBC" stopOpacity={0} />
        </linearGradient>
      </defs>
      {[0, 25, 50, 75, 100].map((v) => (
        <line key={v} x1={padL} y1={py(v)} x2={W - padR} y2={py(v)}
          stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
      ))}
      <polygon points={areaPath} fill="url(#areaGrad)" />
      <polyline points={idealPts} fill="none" stroke="rgba(255,255,255,0.2)"
        strokeWidth={1.5} strokeDasharray="5,4" />
      <polyline points={actualPts} fill="none" stroke="#0ABFBC"
        strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
      {burndownData.map((d, i) => (
        <circle key={i} cx={px(i)} cy={py(d.actual)} r={3.5}
          fill="#080C18" stroke="#0ABFBC" strokeWidth={2} />
      ))}
      {burndownData.map((d, i) => (
        <text key={d.day} x={px(i)} y={H - 8} textAnchor="middle"
          fontSize={10} fontWeight={500} fill="rgba(232,235,244,0.25)"
          fontFamily="'Outfit', sans-serif">
          {d.day}
        </text>
      ))}
    </svg>
  );
};

// ─── Velocity Bar Chart ───────────────────────────────────────────────────────
const VelocityChart = () => {
  const maxVal = 60;
  const chartH = 160;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, height: chartH }}>
      {velocityData.map((d) => {
        const plannedH = Math.round((d.planned / maxVal) * chartH);
        const actualH  = Math.round((d.actual  / maxVal) * chartH);
        return (
          <div key={d.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flex: 1 }}>
            <div style={{ display: 'flex', gap: 5, alignItems: 'flex-end', justifyContent: 'center', width: '100%' }}>
              <div style={{ width: 22, height: plannedH, borderRadius: '6px 6px 0 0', background: 'rgba(255,255,255,0.12)' }} />
              <div style={{ width: 22, height: actualH,  borderRadius: '6px 6px 0 0', background: 'linear-gradient(180deg,#4D9EFF 0%,#1B6BF5 100%)' }} />
            </div>
            <span style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 11, fontWeight: 500,
              color: 'rgba(232,235,244,0.35)', letterSpacing: '0.06em',
            }}>
              {d.name}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// ─── Legend Item ──────────────────────────────────────────────────────────────
const LegendItem = ({ color, label, dashed }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
    <div style={{
      width: 8, height: 8, borderRadius: '50%',
      background: dashed ? 'transparent' : color,
      border: dashed ? '1px dashed rgba(255,255,255,0.4)' : 'none',
    }} />
    <span style={{
      fontFamily: "'Outfit', sans-serif",
      fontSize: 10.5, fontWeight: 500,
      color: 'rgba(232,235,244,0.36)',
      textTransform: 'uppercase', letterSpacing: '0.1em',
    }}>
      {label}
    </span>
  </div>
);

// ─── Chart Card Wrapper ───────────────────────────────────────────────────────
const ChartCard = ({ accentColor, title, right, children, legend }) => (
  <div style={{
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.09)',
    backdropFilter: 'blur(22px)',
    WebkitBackdropFilter: 'blur(22px)',
    borderRadius: 24,
    padding: '28px 28px 20px',
    overflow: 'hidden',
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 3, height: 24, borderRadius: 2, background: accentColor }} />
        <span style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 18, fontWeight: 600,
          color: '#fff', letterSpacing: '0.01em',
        }}>
          {title}
        </span>
      </div>
      {right}
    </div>
    {children}
    {legend && (
      <div style={{ display: 'flex', gap: 18, marginTop: 14 }}>
        {legend.map((l) => <LegendItem key={l.label} {...l} />)}
      </div>
    )}
  </div>
);

// ─── Main Dashboard Page ──────────────────────────────────────────────────────
const DashboardPage = () => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');

      .tf-wrap {
        font-family: 'Outfit', sans-serif;
        background: transparent;
        min-height: 100vh;
        color: #E8EBF4;
        position: relative;
        overflow: hidden;
      }
      .tf-orb {
        position: fixed;
        border-radius: 50%;
        filter: blur(80px);
        opacity: 0.16;
        pointer-events: none;
        z-index: 0;
      }
      .tf-page {
        position: relative;
        z-index: 1;
        max-width: 1280px;
        margin: 0 auto;
        padding: 36px 32px 60px;
      }
      .tf-release-pill:hover {
        background: rgba(255,255,255,0.09) !important;
      }
    `}</style>

    <div className="tf-wrap">
      {/* Ambient Orbs */}
      <div className="tf-orb" style={{ width: 520, height: 520, background: '#1B6BF5', top: -120, left: -80 }} />
      <div className="tf-orb" style={{ width: 400, height: 400, background: '#0ABFBC', top: '40%', right: -100 }} />
      <div className="tf-orb" style={{ width: 300, height: 300, background: '#7C3AED', bottom: -60, left: '30%' }} />

      <div className="tf-page">

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 44 }}>
          <div>
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 34, fontWeight: 700,
              fontStyle: 'italic',
              color: '#000', letterSpacing: '-0.3px',
              lineHeight: 1.1, margin: 0,
            }} className="dark:text-white">
              Executive Dashboard
            </h1>
            <p style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 13.5, fontWeight: 300,
              color: 'rgba(50,50,50,0.6)',
              marginTop: 7, letterSpacing: '0.03em',
            }} className="dark:text-white/50">
              Real-time portfolio health &amp; team performance
            </p>
          </div>

          <div
            className="tf-release-pill"
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 16px', borderRadius: 16,
              background: 'rgba(100,100,100,0.1)',
              border: '1px solid rgba(100,100,100,0.2)',
              backdropFilter: 'blur(22px)',
              WebkitBackdropFilter: 'blur(22px)',
              cursor: 'pointer', transition: 'background 0.2s',
            }}
          >
            <span style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 13, fontWeight: 400,
              color: 'rgba(50,50,50,0.8)', letterSpacing: '0.02em',
            }} className="dark:text-white/80">
              Q1 2025 Release
            </span>
            <span style={{ fontSize: 15, opacity: 0.4 }}>📅</span>
            <span style={{
              fontFamily: "'Outfit', sans-serif",
              background: 'rgba(27,107,245,0.18)',
              border: '1px solid rgba(27,107,245,0.45)',
              color: '#1B6BF5',
              fontSize: 10.5, fontWeight: 600,
              padding: '3px 10px', borderRadius: 20,
              letterSpacing: '0.1em', textTransform: 'uppercase',
            }}>
              Active
            </span>
          </div>
        </div>

        {/* ── Stat Cards ──────────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: 16, marginBottom: 24 }}>
          <StatCard icon="📈" label="Team Velocity"     value="42.5" trend="12%" trendUp
            iconBg="rgba(27,107,245,0.15)"  iconColor="#1B6BF5"  delay={0.05} />
          <StatCard icon="✓"  label="Stories Completed" value="18"   trend="+5"  trendUp
            iconBg="rgba(52,211,153,0.12)"  iconColor="#2ECC71"  delay={0.10} />
          <StatCard icon="⚠"  label="Active Defects"    value="4"    trend="-2"  trendUp={false}
            iconBg="rgba(248,113,113,0.12)" iconColor="#E74C3C"  delay={0.15} />
          <StatCard icon="◎"  label="Team Capacity"     value="92%"  trend="+3%" trendUp
            iconBg="rgba(10,191,188,0.12)"  iconColor="#0ABFBC"  delay={0.20} />
        </div>

        {/* ── Charts Row ──────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 20, marginBottom: 24 }}
        >
          <ChartCard
            accentColor="#1B6BF5"
            title={<span className="text-slate-900 dark:text-white">Team Velocity</span>}
            right={
              <span className="text-slate-500 dark:text-slate-400" style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 10.5, fontWeight: 500,
                textTransform: 'uppercase', letterSpacing: '0.12em',
              }}>
                Last 4 Sprints
              </span>
            }
            legend={[
              { color: 'rgba(150,150,150,0.5)', label: 'Planned' },
              { color: '#1B6BF5', label: 'Actual' },
            ]}
          >
            <VelocityChart />
          </ChartCard>

          <ChartCard
            accentColor="#0ABFBC"
            title={<span className="text-slate-900 dark:text-white">Sprint Burndown</span>}
            right={
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#2ECC71' }} />
                <span style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 10.5, fontWeight: 600,
                  color: '#2ECC71',
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                }}>
                  On Track
                </span>
              </div>
            }
            legend={[
              { color: 'rgba(150,150,150,0.5)', label: 'Ideal Trend', dashed: true },
              { color: '#0ABFBC', label: 'Actual Remaining' },
            ]}
          >
            <BurndownChart />
          </ChartCard>
        </motion.div>

        {/* ── Bottom Row ──────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.42 }}
          style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}
        >
          {/* Team Allocation */}
          <div style={{
            background: 'rgba(150,150,150,0.05)',
            border: '1px solid rgba(150,150,150,0.2)',
            backdropFilter: 'blur(22px)',
            WebkitBackdropFilter: 'blur(22px)',
            borderRadius: 22, padding: 26,
          }}>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 16, fontWeight: 600,
              marginBottom: 22,
              display: 'flex', alignItems: 'center', gap: 9,
            }} className="text-slate-900 dark:text-white">
              <span style={{ fontSize: 15 }}>👥</span> Team Allocation
            </div>

            {teams.map((team) => (
              <div key={team.name} style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 9 }}>
                  <span className="text-slate-500 dark:text-slate-400" style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 13, fontWeight: 400,
                    letterSpacing: '0.01em',
                  }}>
                    {team.name}
                  </span>
                  <span className="text-slate-900 dark:text-white" style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 14, fontWeight: 600,
                  }}>
                    {team.progress}%
                  </span>
                </div>
                <div style={{ height: 5, borderRadius: 10, background: 'rgba(150,150,150,0.2)', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${team.progress}%` }}
                    transition={{ duration: 1.3, delay: 0.55, ease: [0.4, 0, 0.2, 1] }}
                    style={{ height: '100%', borderRadius: 10, background: team.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Milestone Card */}
          <div style={{
            borderRadius: 24, padding: 34,
            position: 'relative', overflow: 'hidden',
            background: 'linear-gradient(135deg,#1B6BF5 0%,#0F2557 100%)',
            border: '1px solid rgba(27,107,245,0.28)',
            boxShadow: '0 8px 40px rgba(27,107,245,0.12)',
          }}>
            <div style={{
              position: 'absolute', top: -80, right: -80,
              width: 260, height: 260, borderRadius: '50%',
              background: 'radial-gradient(circle,rgba(255,255,255,0.2) 0%,transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', bottom: -60, left: '20%',
              width: 200, height: 200, borderRadius: '50%',
              background: 'radial-gradient(circle,rgba(10,191,188,0.2) 0%,transparent 70%)',
              pointerEvents: 'none',
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 30 }}>
                <div>
                  <div style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 24, fontWeight: 700,
                    fontStyle: 'italic',
                    color: '#fff', lineHeight: 1.25,
                    marginBottom: 9, letterSpacing: '0.01em',
                  }}>
                    Portfolio Milestone<br />Reached! 🎯
                  </div>
                  <div style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 13, fontWeight: 300,
                    color: 'rgba(255,255,255,0.8)', letterSpacing: '0.02em',
                  }}>
                    Cloud Migration Phase 1 is now 100% complete.
                  </div>
                </div>
                <div style={{
                  width: 50, height: 50, borderRadius: 15,
                  background: 'rgba(255,255,255,0.2)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 23, backdropFilter: 'blur(10px)',
                }}>
                  📊
                </div>
              </div>

              <div style={{ display: 'flex', gap: 14 }}>
                {[
                  { label: 'Efficiency', value: '+18%'   },
                  { label: 'Quality',    value: '99.2%'  },
                  { label: 'Uptime',     value: '4 Nines'},
                ].map((stat) => (
                  <div key={stat.label} style={{
                    flex: 1, padding: '16px 18px', borderRadius: 16,
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(10px)',
                  }}>
                    <div style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: 10, fontWeight: 500,
                      color: 'rgba(255,255,255,0.7)',
                      textTransform: 'uppercase', letterSpacing: '0.13em',
                      marginBottom: 9,
                    }}>
                      {stat.label}
                    </div>
                    <div style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 26, fontWeight: 700,
                      color: '#fff', letterSpacing: '-0.3px',
                    }}>
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  </>
);

export default DashboardPage;