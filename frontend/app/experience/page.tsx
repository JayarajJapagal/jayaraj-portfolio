'use client'

import AppShell from '@/components/layout/AppShell'
import { useState } from 'react'

const experience = [
  {
    company: 'Mercedes-Benz Research & Development India',
    role: 'Platform & Release Engineer',
    period: 'Oct 2023 → Present',
    location: 'Bengaluru',
    color: '#3b82f6',
    tag: 'CURRENT',
    desc: 'Building CI/CD intelligence platforms and AI-assisted engineering tools for Android Automotive and Yocto-based software delivery at automotive scale.',
    stack: ['GitLab CI/CD', 'Python', 'PostgreSQL', 'Grafana', 'MCP / RAG', 'Android Automotive'],
    points: [
      'Designed and built internal DevOps automation platforms supporting large-scale CI/CD and release engineering workflows',
      'Built centralised pipeline orchestration — duplicate pipeline cancellation, release workflow automation, process standardisation',
      'Developed AI-assisted release letter generation system reducing manual documentation effort significantly',
      'Architected MCP server integrating with GitHub Copilot for pipeline diagnostics and CI/CD troubleshooting from the IDE',
      'Implemented RAG pipeline using sentence-transformers (all-MiniLM-L6-v2) and FAISS to search 100k+ line CI logs in real time',
      'Designed CI/CD Intelligence platform using PostgreSQL and Python — analytics across Gerrit, GitLab, Jira, and pipeline ecosystems',
      'Created Grafana dashboards providing real-time visibility into pipeline health, release status, and engineering metrics',
      'Worked closely with global engineering teams during onsite engagements in Stuttgart, Germany',
    ],
  },
  {
    company: 'Tata Consultancy Services',
    role: 'DevOps Engineer — Team Lead',
    period: 'Jan 2020 → Oct 2023',
    location: 'Bengaluru',
    color: '#34d399',
    tag: 'PREVIOUS',
    desc: 'Led a DevOps team delivering automation and operational solutions. Built Python APIs for Solr cluster management, monitoring pipelines, and deployment tooling.',
    stack: ['Python', 'REST APIs', 'Splunk', 'Grafana', 'Team Lead'],
    points: [
      'Led a DevOps team delivering automation and operational solutions across multiple client engagements',
      'Developed Solr cluster management web app — UI for cluster health, quick fixes for inactive or duplicate replicas',
      'Built Python-based API service for Solr cluster operations, offline indexing, and checksum validation',
      'Implemented disk utilization reporting for capacity planning and resource management',
      'Managed production emergencies — 100% uptime monitoring using Splunk, Hubble, and Grafana',
      'Created RPM package for Python codebase facilitating easy deployment on servers',
    ],
  },
]

const education = [
  {
    institution: 'RNSIT College',
    degree: 'B.Tech — Electronics & Instrumentation Engineering',
    period: 'Jun 2015 → Aug 2019',
    location: 'Bengaluru',
    color: '#8b5cf6',
  },
]

const certifications = [
  { name: 'AWS Cloud Practitioner', issuer: 'Amazon Web Services', color: '#f97316', status: 'Certified' },
  { name: 'AWS Solutions Architect Associate', issuer: 'Amazon Web Services', color: '#f97316', status: 'In Progress' },
]

export default function Experience() {
  const [activeTab, setActiveTab] = useState<'org' | 'edu'>('org')
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <AppShell>
          <div style={{ width: '100%', maxWidth: '720px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '1rem' }}>
              <div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '6px' }}>// career</div>
                <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#e2e4f0', letterSpacing: '-0.5px' }}>
                  Experience<span style={{ color: '#3b82f6' }}>.</span>
                </h1>
                <div style={{ width: '45px', height: '2px', background: 'linear-gradient(90deg, #f97316, #3b82f6)', borderRadius: '1px', marginTop: '0.5rem' }} />
              </div>
              <a
                href="/resume.pdf"
                download
                className="fx-btn-outline"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '9px 16px', borderRadius: '8px', flexShrink: 0,
                  border: '1px solid rgba(59,130,246,0.5)', background: 'rgba(59,130,246,0.08)',
                  color: '#3b82f6', fontSize: '12px', fontWeight: 500,
                  fontFamily: 'JetBrains Mono, monospace', textDecoration: 'none',
                }}
              >
                ⬇ Download Resume
              </a>
            </div>

            {/* Content card */}
            <div className="fade-up" style={{ background: 'linear-gradient(180deg, #2b3459 0%, #262e4f 100%)', border: '1px solid #3a4374', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', animationDelay: '60ms' }}>

            {/* Tabs */}
            <div style={{ display: 'flex', background: '#1a1d2e', border: '1px solid #252840', borderRadius: '8px', padding: '4px', gap: '4px' }}>
              {[{ key: 'org', label: 'Organisations' }, { key: 'edu', label: 'Education' }].map((tab) => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key as 'org' | 'edu')} style={{
                  flex: 1, padding: '8px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                  background: activeTab === tab.key ? '#252840' : 'transparent',
                  color: activeTab === tab.key ? '#e2e4f0' : '#5a5e80',
                  fontSize: '12px', fontFamily: 'JetBrains Mono, monospace',
                  fontWeight: activeTab === tab.key ? 500 : 400,
                  transition: 'all 0.15s',
                }}>{tab.label}</button>
              ))}
            </div>

            {/* Organisations */}
            {activeTab === 'org' && (
              <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                <div style={{ position: 'absolute', left: '7px', top: '8px', bottom: '8px', width: '1px', background: '#252840' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {experience.map((exp, i) => (
                    <div key={exp.company} className="fade-up" style={{ position: 'relative', animationDelay: `${i * 80}ms` }}>
                      <div className={exp.tag === 'CURRENT' ? 'status-dot' : undefined} style={{ position: 'absolute', left: '-1.85rem', top: '1.1rem', width: '12px', height: '12px', borderRadius: '50%', background: exp.color, border: '2px solid #12141f', boxShadow: `0 0 8px ${exp.color}60` }} />
                      <div className="fx-card" style={{ background: '#1a1d2e', border: '1px solid #252840', borderRadius: '10px', overflow: 'hidden' }}>
                        <div onClick={() => setExpanded(expanded === exp.company ? null : exp.company)} style={{ padding: '1.25rem 1.5rem', cursor: 'pointer' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#5a5e80' }}>{exp.period}</span>
                            {exp.tag === 'CURRENT' && (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: '#34d399', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)', padding: '2px 8px', borderRadius: '10px', letterSpacing: '0.5px' }}>
                                <span className="status-dot" style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#34d399' }} />
                                NOW
                              </span>
                            )}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                            <div>
                              <div style={{ fontSize: '16px', fontWeight: 700, color: '#e2e4f0', marginBottom: '4px' }}>{exp.role}</div>
                              <div style={{ fontSize: '12px', color: exp.color, fontFamily: 'JetBrains Mono, monospace' }}>{exp.company} · {exp.location}</div>
                            </div>
                            <span style={{ color: '#5a5e80', fontSize: '18px', marginLeft: '1rem', userSelect: 'none' }}>{expanded === exp.company ? '−' : '+'}</span>
                          </div>
                          <p style={{ fontSize: '13px', color: '#6068a0', lineHeight: 1.65, marginTop: '0.75rem' }}>{exp.desc}</p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '0.75rem' }}>
                            {exp.stack.map((s) => (
                              <span key={s} className="fx-pill" style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', padding: '2px 8px', borderRadius: '4px', background: `${exp.color}10`, color: exp.color, border: `1px solid ${exp.color}25` }}>{s}</span>
                            ))}
                          </div>
                        </div>
                        {expanded === exp.company && (
                          <div style={{ borderTop: '1px solid #252840', padding: '1.25rem 1.5rem' }}>
                            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.875rem' }}>// key contributions</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {exp.points.map((point, i) => (
                                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                  <span style={{ color: exp.color, fontSize: '11px', marginTop: '3px', flexShrink: 0 }}>→</span>
                                  <span style={{ fontSize: '13px', color: '#8890b8', lineHeight: 1.65 }}>{point}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {activeTab === 'edu' && (
              <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                <div style={{ position: 'absolute', left: '7px', top: '8px', bottom: '8px', width: '1px', background: '#252840' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {education.map((edu, i) => (
                    <div key={edu.institution} className="fade-up" style={{ position: 'relative', animationDelay: `${i * 80}ms` }}>
                      <div style={{ position: 'absolute', left: '-1.85rem', top: '1.1rem', width: '12px', height: '12px', borderRadius: '50%', background: edu.color, border: '2px solid #12141f', boxShadow: `0 0 8px ${edu.color}60` }} />
                      <div className="fx-card" style={{ background: '#1a1d2e', border: '1px solid #252840', borderRadius: '10px', padding: '1.25rem 1.5rem' }}>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: '#e2e4f0', marginBottom: '4px' }}>{edu.degree}</div>
                        <div style={{ fontSize: '12px', color: edu.color, fontFamily: 'JetBrains Mono, monospace', marginBottom: '6px' }}>{edu.institution} · {edu.location}</div>
                        <div style={{ fontSize: '11px', color: '#5a5e80', fontFamily: 'JetBrains Mono, monospace' }}>{edu.period}</div>
                      </div>
                    </div>
                  ))}
                  <div className="fade-up" style={{ position: 'relative', animationDelay: `${education.length * 80}ms` }}>
                    <div style={{ position: 'absolute', left: '-1.85rem', top: '1.1rem', width: '12px', height: '12px', borderRadius: '50%', background: '#f97316', border: '2px solid #12141f', boxShadow: '0 0 8px #f9731660' }} />
                    <div className="fx-card" style={{ background: '#1a1d2e', border: '1px solid #252840', borderRadius: '10px', padding: '1.25rem 1.5rem' }}>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#f97316', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem' }}>// certifications</div>
                      {certifications.map((cert, i) => (
                        <div key={cert.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < certifications.length - 1 ? '1px solid #252840' : 'none' }}>
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: 500, color: '#e2e4f0' }}>{cert.name}</div>
                            <div style={{ fontSize: '11px', color: '#5a5e80', fontFamily: 'JetBrains Mono, monospace', marginTop: '2px' }}>{cert.issuer}</div>
                          </div>
                          <span style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', color: cert.status === 'Certified' ? '#34d399' : '#fbbf24', background: cert.status === 'Certified' ? 'rgba(52,211,153,0.1)' : 'rgba(251,191,36,0.1)', border: `1px solid ${cert.status === 'Certified' ? 'rgba(52,211,153,0.2)' : 'rgba(251,191,36,0.2)'}`, padding: '3px 8px', borderRadius: '4px' }}>{cert.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            </div>

          </div>
    </AppShell>
  )
}