import React, { forwardRef } from 'react';
import { differenceInYears } from 'date-fns';

// ── Real clinic logo embedded as base64 ──
const LOGO_BASE64 = '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';

/**
 * PrescriptionTemplate — Sai Heart Care
 * A4 (210mm × 297mm) print-ready prescription document.
 * Theme: Teal (#008B8B) + Slate Grey (#4A5568) — matches clinic logo
 */

const PrescriptionTemplate = forwardRef(({ prescription, patient }, ref) => {
    if (!prescription || !patient) return null;

    const printDate = new Date(prescription.date || Date.now());
    const calculatedAge = patient.dob
        ? differenceInYears(printDate, new Date(patient.dob))
        : patient.age || 'N/A';

    const formatDate = (d) =>
        d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
    const formatTime = (d) =>
        d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    // ── Colour tokens — matched to logo palette ──
    const TEAL       = '#007d80';      // Primary teal from logo
    const TEAL_LIGHT = '#e6f4f4';      // Soft teal tint for backgrounds
    const SLATE      = '#4a5568';      // Slate grey for body text
    const SLATE_DARK = '#2d3748';      // Dark slate for headings
    const BORDER     = '#cbd5e1';
    const LIGHT_BG   = '#f8fafa';

    // ── ECG line SVG decoration ──
    const EcgLine = ({ color = TEAL }) => (
        <svg height="20" width="100%" viewBox="0 0 1000 20" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <polyline
                points="0,10 780,10 790,4 800,18 812,2 824,14 832,10 1000,10"
                fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            />
        </svg>
    );

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap');
        .rx-tpl * { box-sizing: border-box; }
        .rx-tpl table { border-collapse: collapse; width: 100%; }
        .rx-tpl th {
          border-top: 1.5px solid ${TEAL};
          border-bottom: 1.5px solid ${TEAL};
          padding: 7px 10px;
          font-weight: 700;
          text-align: left;
          font-size: 10.5px;
          color: ${TEAL};
          background: ${TEAL_LIGHT};
          letter-spacing: 0.4px;
          text-transform: uppercase;
        }
        .rx-tpl td { padding: 7px 10px; border-bottom: 1px solid ${BORDER}; font-size: 11px; vertical-align: top; color: ${SLATE_DARK}; }
      `}</style>

            <div
                ref={ref}
                className="rx-tpl"
                style={{
                    width: '210mm',
                    minHeight: '295mm',
                    background: '#ffffff',
                    fontFamily: "'Lato', Arial, sans-serif",
                    fontSize: '12px',
                    color: SLATE_DARK,
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    lineHeight: 1.45,
                    overflow: 'hidden',
                }}
            >

                {/* ══ WATERMARK ══ */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 320,
                    height: 320,
                    backgroundImage: `url(data:image/jpeg;base64,${LOGO_BASE64})`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    opacity: 0.05,
                    pointerEvents: 'none',
                    zIndex: 0,
                }} />

                {/* ══════════════ HEADER ══════════════ */}
                <header style={{ padding: '0', position: 'relative', zIndex: 1 }}>

                    {/* Top teal accent bar */}
                    <div style={{ height: 5, background: TEAL, width: '100%' }} />

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '18px 30px 14px',
                    }}>
                        {/* Left: Real Logo + Care Name */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <img
                                src={`data:image/jpeg;base64,${LOGO_BASE64}`}
                                alt="Sai Heart Care Logo"
                                style={{
                                    width: 72,
                                    height: 72,
                                    objectFit: 'contain',
                                    borderRadius: '50%',
                                    border: `2px solid ${TEAL}`,
                                    padding: 3,
                                    background: '#fff',
                                }}
                            />
                            <div>
                                <div style={{
                                    fontSize: 24,
                                    fontWeight: 900,
                                    color: TEAL,
                                    letterSpacing: '0.5px',
                                    lineHeight: 1.1,
                                    textTransform: 'uppercase',
                                }}>
                                    Sai Heart Care
                                </div>
                                <div style={{
                                    fontSize: 11,
                                    fontWeight: 700,
                                    color: SLATE,
                                    letterSpacing: '0.8px',
                                    marginTop: 3,
                                    textTransform: 'uppercase',
                                }}>
                                    Interventional Cardiology
                                </div>
                            </div>
                        </div>

                        {/* Right: Doctor info */}
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 17, color: TEAL, fontWeight: 900, marginBottom: 3 }}>
                                Dr. Sunil Shewale
                            </div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: SLATE, marginBottom: 2 }}>
                                MD (Medicine) · DM (Cardiology) · FACC (USA)
                            </div>
                            <div style={{ fontSize: 11, color: SLATE, marginBottom: 2 }}>
                                Consultant Interventional Cardiologist
                            </div>
                            <div style={{ fontSize: 10, color: SLATE, marginBottom: 2 }}>
                                Reg. No.: MMC 2014/05/XXXX
                            </div>
                            <div style={{ fontSize: 10, color: SLATE }}>
                                Email: demo@gmail.com
                            </div>
                        </div>
                    </div>

                    {/* ECG divider */}
                    <div style={{ width: '100%', paddingBottom: 4 }}>
                        <EcgLine color={TEAL} />
                    </div>
                </header>

                {/* ══════════════ PATIENT INFO ══════════════ */}
                <div style={{
                    padding: '10px 30px 12px',
                    background: TEAL_LIGHT,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 5,
                    fontSize: 12,
                    borderBottom: `1px solid ${BORDER}`,
                    position: 'relative',
                    zIndex: 1,
                }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '130px 12px 1fr' }}>
                        <span style={{ fontWeight: 700, color: TEAL, fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                            {patient.uhid || prescription.tokenNo || 'UHID'}
                        </span>
                        <span style={{ color: SLATE }}>:</span>
                        <span style={{ fontWeight: 700, color: SLATE_DARK }}>
                            {patient.name}
                            {(calculatedAge !== 'N/A' || patient.gender) &&
                                <span style={{ fontWeight: 400, color: SLATE }}>
                                    {' '}({calculatedAge !== 'N/A' ? `${calculatedAge} yrs` : ''}{patient.gender ? `, ${patient.gender}` : ''})
                                </span>
                            }
                            {patient.phone && <span style={{ fontWeight: 400, color: SLATE }}> · {patient.phone}</span>}
                        </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '130px 12px 1fr' }}>
                        <span style={{ fontWeight: 700, color: TEAL, fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                            Date &amp; Time
                        </span>
                        <span style={{ color: SLATE }}>:</span>
                        <span style={{ fontWeight: 700, color: SLATE_DARK }}>
                            {formatDate(printDate)} &nbsp;{formatTime(printDate)}
                        </span>
                    </div>
                </div>

                {/* ══════════════ BODY ══════════════ */}
                <main style={{ flex: 1, padding: '14px 30px', display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 1 }}>

                    {/* ── Complaints + Diagnosis ── */}
                    <section style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 8, paddingBottom: 10, borderBottom: `1px dashed ${BORDER}` }}>
                        {(prescription.complaints || prescription.vitals?.bodyWeight) && (
                            <div style={{ display: 'flex', gap: 8, fontSize: 12 }}>
                                <span style={{ fontWeight: 700, color: TEAL, minWidth: 90, fontSize: 10.5, textTransform: 'uppercase', paddingTop: 1 }}>
                                    Complaints
                                </span>
                                <span style={{ color: SLATE_DARK }}>
                                    {[
                                        prescription.complaints,
                                        prescription.vitals?.bodyWeight ? `Wt: ${prescription.vitals.bodyWeight} kg` : null,
                                        prescription.vitals?.bp ? `BP: ${prescription.vitals.bp}` : null
                                    ].filter(Boolean).join('   ·   ')}
                                </span>
                            </div>
                        )}
                        {prescription.diagnosis && (
                            <div style={{ display: 'flex', gap: 8, fontSize: 12 }}>
                                <span style={{ fontWeight: 700, color: TEAL, minWidth: 90, fontSize: 10.5, textTransform: 'uppercase', paddingTop: 1 }}>
                                    Diagnosis
                                </span>
                                <span style={{ fontWeight: 700, color: SLATE_DARK }}>{prescription.diagnosis}</span>
                            </div>
                        )}
                        {prescription.notes && (
                            <div style={{ fontSize: 11, color: SLATE, marginTop: 2, fontStyle: 'italic' }}>
                                {prescription.notes}
                            </div>
                        )}
                    </section>

                    {/* ── Rx symbol ── */}
                    <div style={{ margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 26, color: TEAL, fontWeight: 900, lineHeight: 1 }}>℞</span>
                        <div style={{ height: 1, flex: 1, background: BORDER }} />
                    </div>

                    {/* ── Medications table ── */}
                    {prescription.medications?.length > 0 ? (
                        <section style={{ minHeight: '280px' }}>
                            <table>
                                <thead>
                                    <tr>
                                        <th style={{ width: '48%' }}>Medicine</th>
                                        <th style={{ width: '18%', textAlign: 'center' }}>Dosage</th>
                                        <th style={{ width: '34%' }}>Timing · Frequency · Duration</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {prescription.medications.map((med, i) => (
                                        <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : LIGHT_BG }}>
                                            <td style={{ display: 'flex', gap: 8 }}>
                                                <span style={{ fontWeight: 700, color: TEAL, minWidth: 18 }}>{i + 1}.</span>
                                                <div>
                                                    <div style={{ fontWeight: 700, fontSize: 11.5, color: SLATE_DARK, textTransform: 'uppercase', letterSpacing: '0.2px' }}>
                                                        {med.name}
                                                    </div>
                                                    {med.composition && (
                                                        <div style={{ fontSize: 10, marginTop: 2, color: SLATE }}>
                                                            Composition: {med.composition}
                                                        </div>
                                                    )}
                                                    {med.timing && (
                                                        <div style={{ fontSize: 10, marginTop: 1, color: SLATE }}>
                                                            Timing: {med.timing}
                                                        </div>
                                                    )}
                                                    {med.remarks && (
                                                        <div style={{ fontSize: 10, marginTop: 1, color: SLATE, fontStyle: 'italic' }}>
                                                            Note: {med.remarks}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td style={{ textAlign: 'center', fontWeight: 700, fontSize: 12, color: SLATE_DARK, verticalAlign: 'top', paddingTop: '8px' }}>
                                                {med.dosage || med.frequency || '—'}
                                            </td>
                                            <td style={{ fontSize: 11, color: SLATE, verticalAlign: 'top', paddingTop: '8px' }}>
                                                {[med.mealTiming, med.freq, med.duration].filter(Boolean).join(' · ') || med.instructions || '—'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </section>
                    ) : (
                        <div style={{ minHeight: '280px' }}></div>
                    )}

                    {/* ── Investigations / Advice / Follow-up ── */}
                    <section style={{
                        display: 'flex',
                        gap: 15,
                        flexWrap: 'wrap',
                        marginTop: 12,
                        paddingTop: 12,
                        borderTop: `1px dashed ${BORDER}`,
                    }}>
                        {prescription.investigations && (
                            <div style={{ flex: 1, minWidth: 180 }}>
                                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: TEAL, marginBottom: 5, letterSpacing: '0.5px', borderBottom: `1px solid ${TEAL}`, paddingBottom: 3 }}>
                                    Investigations Advised
                                </div>
                                <div style={{ fontSize: 11, lineHeight: 1.6, color: SLATE_DARK }}>
                                    {prescription.investigations}
                                </div>
                            </div>
                        )}

                        {prescription.advice?.some(a => a.trim()) && (
                            <div style={{ flex: 1, minWidth: 180 }}>
                                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: TEAL, marginBottom: 5, letterSpacing: '0.5px', borderBottom: `1px solid ${TEAL}`, paddingBottom: 3 }}>
                                    Advice / Instructions
                                </div>
                                <ul style={{ margin: 0, paddingLeft: 14, fontSize: 11, lineHeight: 1.7, color: SLATE_DARK }}>
                                    {prescription.advice.filter(a => a.trim()).map((adv, i) => (
                                        <li key={i}>{adv}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {prescription.followUpDate && (
                            <div style={{ flex: 1, minWidth: 130 }}>
                                <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: TEAL, marginBottom: 5, letterSpacing: '0.5px', borderBottom: `1px solid ${TEAL}`, paddingBottom: 3 }}>
                                    Follow-up
                                </div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: TEAL }}>
                                    {new Date(prescription.followUpDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                </div>
                            </div>
                        )}
                    </section>

                    {/* ── Signature area ── */}
                    <section style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 28 }}>
                        <div style={{ width: 200, textAlign: 'center' }}>
                            <div style={{ height: 55, borderBottom: `1.5px solid ${SLATE}`, marginBottom: 5 }}></div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: SLATE_DARK }}>Dr. Sunil Shewale</div>
                            <div style={{ fontSize: 10, color: SLATE, marginTop: 2 }}>MD (Medicine) · DM (Cardiology) · FACC (USA)</div>
                        </div>
                    </section>

                </main>

                {/* ══════════════ FOOTER ══════════════ */}
                <footer style={{ marginTop: 'auto', padding: '0 30px 16px', fontSize: 11, position: 'relative', zIndex: 1 }}>

                    {/* ECG + appointment row */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderTop: `2px solid ${TEAL}`,
                        paddingTop: 8,
                        marginBottom: 10,
                    }}>
                        <div style={{ fontSize: 12, color: SLATE_DARK }}>
                            Appointment: &nbsp;
                            <strong style={{ color: TEAL, fontSize: 13 }}>074474 45121</strong>
                        </div>
                        <div style={{ width: 160 }}>
                            <EcgLine color={TEAL} />
                        </div>
                    </div>

                    {/* Address & disclaimer row */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: 20,
                    }}>
                        {/* Left */}
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: 11, color: SLATE_DARK, lineHeight: 1.5, marginBottom: 4 }}>
                                सिंदगी कॉम्प्लेक्स, पहिला मजला, जुना एम्प्लॉयमेंट चौक,<br />
                                कामत हॉटेल समोर, रेल्वे लाईन्स, सोलापूर, महाराष्ट्र ४१३००१
                            </div>
                            <ul style={{ margin: 0, paddingLeft: 12, fontSize: 9.5, lineHeight: 1.5, color: SLATE }}>
                                <li>Medicines may be substituted with economical generic alternatives as per patient's choice.</li>
                                <li>Do not change or stop medicines without doctor's advice.</li>
                                <li>सल्ल्याशिवाय औषधे बंद करू नये. &nbsp; दिलेली औषधे नियमित घ्यावीत.</li>
                            </ul>
                        </div>

                        {/* Right */}
                        <div style={{ flex: 1, textAlign: 'right', lineHeight: 1.5, fontSize: 10.5, color: SLATE_DARK }}>
                            <div style={{ fontWeight: 700, color: TEAL }}>तातडीच्या वेळी</div>
                            <div style={{ fontWeight: 700 }}>श्री मार्कंडेय सहकारी रूग्णालय संशोधन केंद्र</div>
                            <div>फायनल प्लॉट क्र. 19, MWCC+V37, मार्कंडेय रूग्णालय रोड, नवीन पच्चा पेठ, साखर पेठ, सोलापूर, महाराष्ट्र 413005</div>
                            <div style={{ fontWeight: 700, color: TEAL }}>संपर्क: ०२१७ ३५० २०००</div>
                            <div style={{ fontWeight: 700 }}>श्रीराम हार्ट केअर सेंटर आणि नेत्र रुग्णालय</div>
                            <div>क्र. 95/1, रेल्वे लाईन्स जवळ, नेव्हल पेट्रोल पंप सोलापूर, समोर, रामलाल चौक, सोलापूर-413002, महाराष्ट्र</div>
                            <div style={{ fontWeight: 700, color: TEAL }}>संपर्क: ०२१७ २३२ ९३९७</div>
                        </div>
                    </div>

                    {/* Bottom bar */}
                    <div style={{ height: 3, background: TEAL, marginTop: 12, borderRadius: 2 }} />

                    <div style={{ textAlign: 'center', fontSize: 8.5, color: BORDER, marginTop: 6, letterSpacing: '0.5px' }}>
                        Powered by Integrity Solutions
                    </div>
                </footer>

            </div>
        </>
    );
});

PrescriptionTemplate.displayName = 'PrescriptionTemplate';

export default PrescriptionTemplate;