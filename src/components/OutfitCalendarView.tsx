import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Check,
  X,
  Sparkles,
  Layers,
  Thermometer,
  CloudSun,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OutfitCalendarEntry, Outfit, OccasionType } from '../types/database';

const DAYS_OF_WEEK: OutfitCalendarEntry['dayOfWeek'][] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const OutfitCalendarView: React.FC = () => {
  const {
    calendar,
    outfits,
    assignToCalendar,
    removeFromCalendar,
    toggleCalendarWorn,
    setCurrentView,
    showToast,
  } = useApp();

  const [assignModalDay, setAssignModalDay] = useState<OutfitCalendarEntry['dayOfWeek'] | null>(null);
  const [selectedOutfitId, setSelectedOutfitId] = useState<string>(outfits[0]?.id || '');
  const [modalNotes, setModalNotes] = useState('');

  const handleOpenAssignModal = (day: OutfitCalendarEntry['dayOfWeek']) => {
    setAssignModalDay(day);
    setSelectedOutfitId(outfits[0]?.id || '');
    setModalNotes('');
  };

  const handleConfirmAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignModalDay || !selectedOutfitId) return;

    const chosenOutfit = outfits.find((o) => o.id === selectedOutfitId);
    if (!chosenOutfit) return;

    // Estimate date string for demo
    const dateStr = `2026-09-${28 + DAYS_OF_WEEK.indexOf(assignModalDay)}`;

    assignToCalendar(
      assignModalDay,
      dateStr,
      selectedOutfitId,
      chosenOutfit.occasion,
      modalNotes || undefined
    );

    setAssignModalDay(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-stone-500 mb-1">
            <span>Weekly Agenda</span>
            <span aria-hidden="true">·</span>
            <span>Style Logistics</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-stone-900 dark:text-stone-100">
            Outfit Calendar
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-xl">
            Eliminate morning decision fatigue. Schedule complete looks for Monday through Sunday tailored to your meetings, dinners, and events.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('builder')}
          className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 font-medium text-xs rounded-lg hover:opacity-95 transition-opacity"
        >
          <Layers className="w-4 h-4" />
          <span>Build New Look</span>
        </button>
      </div>

      {/* 7-Day Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {DAYS_OF_WEEK.map((day, idx) => {
          const entry = calendar.find((c) => c.dayOfWeek === day);
          const assignedOutfit = entry ? outfits.find((o) => o.id === entry.outfitId) : null;

          return (
            <div
              key={day}
              className={`rounded-2xl border flex flex-col justify-between transition-all ${
                entry
                  ? 'bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-700 shadow-xs'
                  : 'bg-stone-50/70 dark:bg-stone-950/70 border-dashed border-stone-300 dark:border-stone-800'
              }`}
            >
              {/* Day Header */}
              <div className="p-3.5 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-sm font-semibold text-stone-900 dark:text-stone-100">
                    {day}
                  </h3>
                  <span className="text-[10px] text-stone-400">Sep {28 + idx}</span>
                </div>
                {entry && (
                  <button
                    onClick={() => toggleCalendarWorn(entry.id)}
                    title={entry.isWorn ? 'Mark as Not Worn' : 'Mark as Worn'}
                    className={`p-1.5 rounded-full transition-colors ${
                      entry.isWorn
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                        : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-200'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Day Content */}
              <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                {assignedOutfit ? (
                  <div className="space-y-2.5">
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                        {assignedOutfit.occasion}
                      </span>
                      <h4 className="font-serif text-sm font-medium text-stone-900 dark:text-stone-100 line-clamp-2">
                        {assignedOutfit.title}
                      </h4>
                      <p className="text-[11px] text-stone-500 line-clamp-2">
                        {assignedOutfit.description}
                      </p>
                    </div>

                    {/* Color Swatches */}
                    <div className="flex items-center gap-1">
                      {assignedOutfit.colorPalette.map((c, i) => (
                        <span
                          key={i}
                          title={c.name}
                          style={{ backgroundColor: c.hex }}
                          className="w-3 h-3 rounded-full border border-stone-300 dark:border-stone-700"
                        />
                      ))}
                    </div>

                    {/* Weather & Notes */}
                    {entry?.weatherForecast && (
                      <div className="flex items-center gap-1.5 text-[10px] text-stone-500">
                        <CloudSun className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{entry.weatherForecast}</span>
                      </div>
                    )}

                    {entry?.notes && (
                      <p className="text-[10px] text-stone-600 dark:text-stone-400 bg-stone-50 dark:bg-stone-950 p-2 rounded-md italic">
                        "{entry.notes}"
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="py-8 text-center space-y-2">
                    <CalendarIcon className="w-6 h-6 mx-auto text-stone-300 dark:text-stone-700" />
                    <p className="text-xs text-stone-400">No outfit planned</p>
                  </div>
                )}

                {/* Day Action */}
                <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
                  {assignedOutfit && entry ? (
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleOpenAssignModal(day)}
                        className="text-[11px] font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                      >
                        Change
                      </button>
                      <button
                        onClick={() => removeFromCalendar(entry.id)}
                        className="p-1 text-stone-400 hover:text-rose-600 rounded-sm"
                        title="Unassign outfit"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleOpenAssignModal(day)}
                      className="w-full py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Plan Outfit</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Assign Outfit Modal */}
      {assignModalDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-medium text-stone-900 dark:text-stone-100">
                  Plan Look for {assignModalDay}
                </h3>
                <p className="text-xs text-stone-500">
                  Select from your saved looks
                </p>
              </div>
              <button
                onClick={() => setAssignModalDay(null)}
                className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmAssignment} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  Choose Saved Outfit
                </label>
                <select
                  value={selectedOutfitId}
                  onChange={(e) => setSelectedOutfitId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-500"
                >
                  {outfits.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.title} ({o.occasion})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  Agenda / Notes for {assignModalDay}
                </label>
                <input
                  type="text"
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  placeholder="e.g. Quarterly Executive Presentation & Dinner"
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-500"
                />
              </div>

              <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAssignModalDay(null)}
                  className="px-4 py-2 text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 font-medium text-xs rounded-lg hover:opacity-95 transition-opacity"
                >
                  Assign to {assignModalDay}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
