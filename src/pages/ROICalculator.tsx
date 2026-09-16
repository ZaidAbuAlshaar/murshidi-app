import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Check, AlertTriangle, Printer } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import SourceNote from '../components/SourceNote';
import { majorsData, universitiesData, DATASET_SOURCES, type Major, type University } from '../data/majors';
import { useLang } from '../i18n/LangContext';
import { recordActivity } from '../lib/activity';
import type { TranslationKey } from '../i18n/translations';

interface ROIResult {
  major: Major;
  university: University;
  totalCost: number;
  totalIncome: number;
  netROI: number;
  annualReturn: number;
  paybackYears: number;
  acceptable: boolean;
}

const citiesAR = ['عمّان', 'إربد', 'الزرقاء', 'الكرك', 'العقبة', 'المفرق', 'البلقاء', 'مادبا'];
const citiesEN = ['Amman', 'Irbid', 'Zarqa', 'Karak', 'Aqaba', 'Mafraq', 'Balqa', 'Madaba'];

export default function ROICalculator() {
  const { t, lang, dir } = useLang();
  const NextIcon = dir === 'rtl' ? ChevronLeft : ChevronRight;
  const cities = lang === 'ar' ? citiesAR : citiesEN;

  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [gpa, setGpa] = useState(85);
  const [budget, setBudget] = useState(5000);
  const [city, setCity] = useState(cities[0]);
  const [selectedMajors, setSelectedMajors] = useState<string[]>([]);
  // The report is stamped when the student asks for results, not while
  // rendering — reading the clock during render makes the component impure.
  const [issuedAt, setIssuedAt] = useState<number | null>(null);

  const toggleMajor = (id: string) => {
    setSelectedMajors((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const results: ROIResult[] = useMemo(() => {
    if (step !== 2) return [];
    const uni = universitiesData[0];
    return selectedMajors
      .map((id) => {
        const m = majorsData.find((x) => x.id === id)!;
        const yearlyTuition = gpa >= m.averageAcceptance ? m.yearlyTuitionGov : m.yearlyTuitionPrivate;
        const isAmman = city === 'عمّان' || city === 'Amman';
        const transport = isAmman ? 800 : 2000;
        const totalCost = yearlyTuition * m.duration + (transport + 1500) * m.duration;
        const employmentProb = 1 - m.unemploymentRate / 100;
        const tenYearIncome =
          (((m.firstSalary + m.fiveYearSalary) / 2) * 12 * 5 +
            ((m.fiveYearSalary + m.tenYearSalary) / 2) * 12 * 5) *
          employmentProb;
        const netROI = tenYearIncome - totalCost;
        const annualReturn = (Math.pow(tenYearIncome / totalCost, 1 / 10) - 1) * 100;
        return {
          major: m,
          university: uni,
          totalCost,
          totalIncome: tenYearIncome,
          netROI,
          annualReturn,
          paybackYears: totalCost / (m.firstSalary * 12 * employmentProb),
          acceptable: gpa >= m.averageAcceptance,
        };
      })
      .sort((a, b) => b.netROI - a.netROI);
  }, [step, selectedMajors, gpa, city]);

  return (
    <div className="min-h-screen bg-gov-bg pb-24">
      <PageHeader title={t('calc.title')} subtitle={t('calc.subtitle')} />

      {/* Stepper */}
      <div className="bg-white border-b border-gov-line px-4 py-3">
        <div className="flex items-center gap-2">
          {[
            { n: 1, l: t('calc.step.data') },
            { n: 2, l: t('calc.step.majors') },
            { n: 3, l: t('calc.step.results') },
          ].map((s, i) => (
            <div key={s.n} className="flex items-center gap-2 flex-1">
              <div
                className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center ${
                  i <= step ? 'bg-gov-navy text-white' : 'bg-gov-bg text-gov-muted border border-gov-line'
                }`}
              >
                {i < step ? <Check size={12} /> : s.n}
              </div>
              <span className={`text-[11px] ${i <= step ? 'text-gov-ink font-semibold' : 'text-gov-muted'}`}>
                {s.l}
              </span>
              {i < 2 && <div className={`flex-1 h-px ${i < step ? 'bg-gov-navy' : 'bg-gov-line'}`} />}
            </div>
          ))}
        </div>
      </div>

      {/* Step 0: Form */}
      {step === 0 && (
        <div className="p-4 space-y-3">
          <div className="gov-card p-4">
            <h3 className="text-sm font-bold text-gov-ink mb-3">{t('calc.basicInfo')}</h3>

            {/* GPA — number input + stepper */}
            <div className="mb-4">
              <label className="gov-label">{t('calc.gpa')}</label>
              <div className="flex items-stretch gap-2">
                <button
                  type="button"
                  onClick={() => setGpa((v) => Math.max(60, v - 1))}
                  className="w-12 rounded-md border border-gov-line bg-white text-gov-navy text-xl font-bold hover:bg-gov-bg-soft active:bg-gov-bg transition-colors"
                  aria-label="إنقاص"
                >
                  −
                </button>
                <input
                  type="number"
                  inputMode="numeric"
                  min={60}
                  max={100}
                  value={gpa}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    if (!isNaN(v)) setGpa(Math.min(100, Math.max(60, v)));
                  }}
                  className="gov-input flex-1 text-center font-bold text-xl tabular"
                />
                <button
                  type="button"
                  onClick={() => setGpa((v) => Math.min(100, v + 1))}
                  className="w-12 rounded-md border border-gov-line bg-white text-gov-navy text-xl font-bold hover:bg-gov-bg-soft active:bg-gov-bg transition-colors"
                  aria-label="زيادة"
                >
                  +
                </button>
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <p className="gov-hint">{t('calc.gpa.range')}</p>
                <p className="text-[11px] font-semibold text-gov-navy">
                  {gpa >= 95 ? t('calc.gpa.excellent')
                    : gpa >= 85 ? t('calc.gpa.veryGood')
                    : gpa >= 75 ? t('calc.gpa.good')
                    : gpa >= 65 ? t('calc.gpa.acceptable')
                    : t('calc.gpa.low')}
                </p>
              </div>
            </div>

            {/* Budget — number input + stepper */}
            <div className="mb-4">
              <label className="gov-label">{t('calc.budget')}</label>
              <div className="flex items-stretch gap-2">
                <button
                  type="button"
                  onClick={() => setBudget((v) => Math.max(500, v - 500))}
                  className="w-12 rounded-md border border-gov-line bg-white text-gov-navy text-xl font-bold hover:bg-gov-bg-soft active:bg-gov-bg transition-colors"
                  aria-label="إنقاص"
                >
                  −
                </button>
                <input
                  type="number"
                  inputMode="numeric"
                  min={500}
                  max={50000}
                  step={500}
                  value={budget}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    if (!isNaN(v)) setBudget(Math.max(0, v));
                  }}
                  className="gov-input flex-1 text-center font-bold text-xl tabular"
                />
                <button
                  type="button"
                  onClick={() => setBudget((v) => v + 500)}
                  className="w-12 rounded-md border border-gov-line bg-white text-gov-navy text-xl font-bold hover:bg-gov-bg-soft active:bg-gov-bg transition-colors"
                  aria-label="زيادة"
                >
                  +
                </button>
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <p className="gov-hint">{t('calc.budget.includes')}</p>
                <p className="text-[11px] font-semibold text-gov-navy tabular">
                  {budget.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')} {t('common.dinar')}
                </p>
              </div>
              {/* Quick presets */}
              <div className="flex gap-1.5 mt-2">
                {[2000, 5000, 10000, 18000].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setBudget(v)}
                    className={`flex-1 px-2 py-1.5 rounded-md text-[11px] font-semibold border transition-colors ${
                      budget === v
                        ? 'bg-gov-navy text-white border-gov-navy'
                        : 'bg-white text-gov-body border-gov-line hover:bg-gov-bg-soft'
                    }`}
                  >
                    {(v / 1000)}K
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="gov-label">{t('calc.governorate')}</label>
              <select value={city} onChange={(e) => setCity(e.target.value)} className="gov-input">
                {cities.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <button onClick={() => setStep(1)} className="btn-primary w-full">
            {t('calc.btn.continueToMajors')}
            <NextIcon size={16} />
          </button>
        </div>
      )}

      {/* Step 1: Pick majors */}
      {step === 1 && (
        <div className="p-4">
          <div className="bg-gov-bg-soft border border-gov-line rounded-gov p-3 mb-3">
            <p className="text-xs text-gov-body">
              {t('calc.pickMajors')} <span className="font-bold">{selectedMajors.length}/3 {t('calc.selected')}</span>
            </p>
          </div>

          <div className="gov-card divide-y divide-gov-line">
            {majorsData.map((m) => {
              const sel = selectedMajors.includes(m.id);
              const eligible = gpa >= m.averageAcceptance;
              const displayName = lang === 'ar' ? m.nameAr : m.nameEn;
              const secondaryName = lang === 'ar' ? m.nameEn : m.nameAr;
              return (
                <label
                  key={m.id}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gov-bg-soft"
                >
                  <input
                    type="checkbox"
                    checked={sel}
                    onChange={() => toggleMajor(m.id)}
                    disabled={!sel && selectedMajors.length >= 3}
                    className="w-4 h-4 accent-gov-navy"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-gov-ink">{displayName}</p>
                      {eligible ? (
                        <span className="gov-badge gov-badge-success">{t('calc.eligible')}</span>
                      ) : (
                        <span className="gov-badge gov-badge-warn">{t('calc.minRequired')} {m.averageAcceptance}</span>
                      )}
                    </div>
                    <p className="text-[11px] text-gov-muted mt-0.5">
                      {secondaryName} · {m.duration} {t('calc.years')} · {m.unemploymentRate}%
                    </p>
                  </div>
                </label>
              );
            })}
          </div>

          <SourceNote
            className="mt-3"
            source={DATASET_SOURCES.majors}
            note={t('data.note.acceptance')}
          />

          <div className="flex gap-2 mt-4">
            <button onClick={() => setStep(0)} className="btn-secondary flex-1">{t('btn.back')}</button>
            <button
              onClick={() => {
                setIssuedAt(Date.now());
                recordActivity('calculation');
                setStep(2);
              }}
              disabled={selectedMajors.length === 0}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('btn.showResults')}
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Results */}
      {step === 2 && (
        <div className="p-4 space-y-3">
          {/* Reference */}
          <div className="gov-card p-3 flex items-center justify-between text-[11px]">
            <div className="text-gov-muted">
              <p>{t('calc.report')}: {issuedAt ? `MRSH-${Math.floor(issuedAt / 1000)}` : '—'}</p>
              <p>
                {t('calc.reportDate')}:{' '}
                {issuedAt ? new Date(issuedAt).toLocaleDateString(lang === 'ar' ? 'ar-JO' : 'en-US') : '—'}
              </p>
            </div>
            <button className="btn-ghost text-[11px]">
              <Printer size={12} />
              {t('btn.print')}
            </button>
          </div>

          {/* Recommendation */}
          {results.length > 0 && (
            <div className="gov-card p-4 border-r-4 border-r-gov-green">
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-md bg-gov-green/10 flex items-center justify-center text-gov-green shrink-0">
                  <Check size={15} />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-semibold text-gov-green">{t('calc.recommendation')}</p>
                  <h3 className="text-base font-bold text-gov-ink mt-1">
                    {lang === 'ar' ? results[0].major.nameAr : results[0].major.nameEn} — {t('calc.highestReturn')}
                  </h3>
                  <p className="text-xs text-gov-body mt-1.5 leading-relaxed">
                    {t('calc.expectedROI')}: <strong>{results[0].netROI.toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')} {t('common.dinar')}</strong>,
                    {' '}{t('calc.annualReturn')} {results[0].annualReturn.toFixed(1)}%.
                  </p>
                  <SourceNote className="mt-2" source={DATASET_SOURCES.majors} />
                </div>
              </div>
            </div>
          )}

          {/* Detailed cards */}
          {results.map((r, i) => (
            <ResultRow key={r.major.id} r={r} rank={i + 1} t={t} lang={lang} />
          ))}

          {/* Source disclosure */}
          <div className="bg-gov-bg-soft border border-gov-line rounded-gov p-3">
            <p className="text-[11px] font-semibold text-gov-body text-start">{t('calc.methodology')}:</p>
            <p className="text-[11px] text-gov-muted leading-relaxed text-start mt-0.5">
              {lang === 'ar'
                ? 'العائد = الدخل المتوقّع لعشر سنوات (مرجّح بنسبة التوظيف المفترضة للتخصّص) − إجمالي كلفة الدراسة (الرسوم + النقل + الإقامة + الكتب).'
                : 'Net ROI = expected 10-year income (weighted by the assumed employment rate of the major) − total study cost (tuition + transport + housing + books).'}
            </p>
            <SourceNote className="mt-2" source={DATASET_SOURCES.majors} note={t('data.note.roi')} />
            <p className="text-[10.5px] text-gov-muted leading-relaxed mt-1.5 text-start">
              {t('data.note.acceptance')}
            </p>
          </div>

          <button onClick={() => setStep(0)} className="btn-secondary w-full">
            {t('btn.startNew')}
          </button>
        </div>
      )}
    </div>
  );
}

function ResultRow({ r, rank, t, lang }: {
  r: ROIResult;
  rank: number;
  t: (k: TranslationKey) => string;
  lang: 'ar' | 'en';
}) {
  const numLocale = lang === 'ar' ? 'ar-EG' : 'en-US';
  return (
    <div className="gov-card overflow-hidden">
      <div className="px-4 py-3 bg-gov-bg-soft border-b border-gov-line flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-gov-navy text-white text-[11px] font-bold flex items-center justify-center">
            {rank}
          </span>
          <div>
            <p className="text-sm font-bold text-gov-ink">{lang === 'ar' ? r.major.nameAr : r.major.nameEn}</p>
            <p className="text-[10px] text-gov-muted">{lang === 'ar' ? r.university.nameAr : r.university.nameEn}</p>
          </div>
        </div>
        {r.acceptable ? (
          <span className="gov-badge gov-badge-success">
            <Check size={10} />
            {t('calc.govAccepted')}
          </span>
        ) : (
          <span className="gov-badge gov-badge-warn">
            <AlertTriangle size={10} />
            {t('calc.privateOnly')}
          </span>
        )}
      </div>

      <table className="gov-table">
        <tbody>
          <tr>
            <td className="text-gov-muted">{t('calc.minRequired')}</td>
            <td className="text-end font-semibold tabular">{r.major.averageAcceptance}</td>
          </tr>
          <tr>
            <td className="text-gov-muted">{t('calc.duration')}</td>
            <td className="text-end font-semibold tabular">{r.major.duration} {t('calc.years')}</td>
          </tr>
          <tr>
            <td className="text-gov-muted">{t('calc.totalCost')}</td>
            <td className="text-end font-semibold tabular">{r.totalCost.toLocaleString(numLocale)} {t('common.dinar')}</td>
          </tr>
          <tr>
            <td className="text-gov-muted">{t('calc.unemploymentRate')}</td>
            <td className={`text-end font-semibold tabular ${r.major.unemploymentRate > 25 ? 'text-gov-danger' : r.major.unemploymentRate > 15 ? 'text-gov-warn' : 'text-gov-ok'}`}>
              {r.major.unemploymentRate}%
            </td>
          </tr>
          <tr>
            <td className="text-gov-muted">{t('calc.firstSalary')}</td>
            <td className="text-end font-semibold tabular">{r.major.firstSalary} {t('common.dinar')}/{t('common.month')}</td>
          </tr>
          <tr>
            <td className="text-gov-muted">{t('calc.tenYearSalary')}</td>
            <td className="text-end font-semibold tabular">{r.major.tenYearSalary} {t('common.dinar')}/{t('common.month')}</td>
          </tr>
          <tr className="bg-gov-bg-soft">
            <td className="text-gov-body font-semibold">{t('calc.netROI10y')}</td>
            <td className={`text-end font-bold tabular text-base ${r.netROI > 0 ? 'text-gov-ok' : 'text-gov-danger'}`}>
              {r.netROI > 0 ? '+' : ''}{r.netROI.toLocaleString(numLocale)} {t('common.dinar')}
            </td>
          </tr>
          <tr className="bg-gov-bg-soft">
            <td className="text-gov-body font-semibold">{t('calc.annualReturnRate')}</td>
            <td className="text-end font-bold tabular text-gov-navy">{r.annualReturn.toFixed(2)}%</td>
          </tr>
          <tr className="bg-gov-bg-soft">
            <td className="text-gov-body font-semibold">{t('calc.paybackPeriod')}</td>
            <td className="text-end font-bold tabular text-gov-ink">{r.paybackYears.toFixed(1)} {t('calc.year')}</td>
          </tr>
        </tbody>
      </table>

      <div className="px-4 py-2.5 border-t border-gov-line">
        <SourceNote source={r.major.source} />
      </div>
    </div>
  );
}
