import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  Sparkles, 
  User, 
  Mail, 
  ShieldCheck, 
  RotateCcw
} from 'lucide-react';
import { ConceptId } from '../types';

interface Review {
  id: string;
  conceptId: ConceptId;
  authorName: string;
  email?: string;
  rating: number;
  tags: string[];
  comment: string;
  date: string;
  isCurrentUser?: boolean;
}

const STAR_LABELS = [
  'Cliquez sur une étoile',
  'Encore confus / Pas clair',
  'Moyen / Demande des efforts',
  'Bien compris !',
  'Très clair & pédagogique',
  'Déclic immédiat ! 💡',
];

const QUICK_TAGS = [
  '💡 Déclic visuel',
  '🧩 Pseudo-code clair',
  '⚡ Super interactif',
  '⏱️ Rapide & efficace',
  '🤔 J’aimerais plus d’exemples',
];

interface ConceptFeedbackProps {
  conceptId: ConceptId;
  conceptTitle: string;
}

export default function ConceptFeedback({ conceptId, conceptTitle }: ConceptFeedbackProps) {
  // Form State
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [authorName, setAuthorName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);
  
  // Feedback submission state
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [storageKey, setStorageKey] = useState<string>(`algo_review_${conceptId}`);
  const [allReviews, setAllReviews] = useState<Review[]>([]);

  // Load actual reviews strictly from localStorage on concept change
  useEffect(() => {
    const key = `algo_review_${conceptId}`;
    setStorageKey(key);

    const savedLocal = localStorage.getItem(key);
    if (savedLocal) {
      try {
        const parsed = JSON.parse(savedLocal) as Review;
        setRating(parsed.rating);
        setComment(parsed.comment);
        setSelectedTags(parsed.tags || []);
        setAuthorName(parsed.authorName);
        setEmail(parsed.email || '');
        setIsAnonymous(!parsed.authorName || parsed.authorName === 'Apprenant anonyme');
        setHasSubmitted(true);
        setAllReviews([parsed]);
      } catch {
        setHasSubmitted(false);
        setAllReviews([]);
      }
    } else {
      // Reset form for fresh concept with zero fake reviews
      setRating(0);
      setHoverRating(0);
      setComment('');
      setSelectedTags([]);
      setAuthorName('');
      setEmail('');
      setIsAnonymous(true);
      setHasSubmitted(false);
      setAllReviews([]);
    }
  }, [conceptId]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    const newReview: Review = {
      id: `user_${Date.now()}`,
      conceptId,
      authorName: isAnonymous ? 'Apprenant anonyme' : (authorName.trim() || 'Apprenant curieux'),
      email: isAnonymous ? undefined : email.trim(),
      rating,
      tags: selectedTags,
      comment: comment.trim(),
      date: 'À l’instant',
      isCurrentUser: true,
    };

    localStorage.setItem(storageKey, JSON.stringify(newReview));
    setHasSubmitted(true);
    setAllReviews([newReview]);
  };

  const handleResetReview = () => {
    localStorage.removeItem(storageKey);
    setHasSubmitted(false);
    setRating(0);
    setComment('');
    setSelectedTags([]);
    setAllReviews([]);
  };

  // Real statistics based strictly on authentic submitted reviews
  const currentTotal = allReviews.length;
  const currentAvg = currentTotal > 0 
    ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / currentTotal).toFixed(1)
    : null;

  const displayedRating = hoverRating > 0 ? hoverRating : rating;

  return (
    <section className="mt-12 pt-8 border-t border-slate-800/80">
      <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/90 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-xl">
        
        {/* Banner / Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/60">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Retour d’apprentissage
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Cet exercice vous a-t-il aidé à comprendre la notion ?
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              Votre avis compte énormément pour affiner la pédagogie et enrichir le <strong className="text-slate-300">Niveau 1</strong>.
            </p>
          </div>

          {/* Authentic Real Rating Indicator (shown only if a review exists) */}
          {currentAvg ? (
            <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-3 rounded-xl border border-slate-800 self-start sm:self-auto shrink-0">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.round(Number(currentAvg)) ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} 
                  />
                ))}
              </div>
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-1">
                  {currentAvg} <span className="text-slate-400 text-xs font-normal">/ 5</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {currentTotal} avis enregistré
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-slate-900/60 px-3.5 py-2 rounded-xl border border-slate-800 text-xs text-slate-400 self-start sm:self-auto shrink-0">
              <Star className="w-3.5 h-3.5 text-amber-400" />
              <span>Notez votre compréhension de 1 à 5 ⭐</span>
            </div>
          )}
        </div>

        {/* Submission Form OR Submitted Success View */}
        {!hasSubmitted ? (
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            
            {/* 1. Interactive Star Rating */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                1. Évaluez votre niveau de compréhension :
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <div 
                  className="flex items-center gap-1.5 bg-slate-950 p-2 rounded-xl border border-slate-800"
                  onMouseLeave={() => setHoverRating(0)}
                >
                  {[1, 2, 3, 4, 5].map((starVal) => {
                    const isFilled = starVal <= displayedRating;
                    return (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setRating(starVal)}
                        onMouseEnter={() => setHoverRating(starVal)}
                        className="p-1.5 transition-transform hover:scale-125 focus:outline-none focus:ring-2 focus:ring-amber-400 rounded-lg cursor-pointer"
                        aria-label={`${starVal} étoile${starVal > 1 ? 's' : ''}`}
                      >
                        <Star 
                          className={`w-7 h-7 transition-colors ${
                            isFilled 
                              ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' 
                              : 'text-slate-600 hover:text-slate-400'
                          }`} 
                        />
                      </button>
                    );
                  })}
                </div>

                <span className={`text-sm font-medium px-3 py-1.5 rounded-lg border transition-all ${
                  displayedRating > 0 
                    ? 'text-amber-300 bg-amber-500/10 border-amber-500/30' 
                    : 'text-slate-500 bg-slate-900 border-slate-800'
                }`}>
                  {STAR_LABELS[displayedRating] || STAR_LABELS[0]}
                </span>
              </div>
            </div>

            {/* 2. Quick Tags */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-2">
                2. Qu’avez-vous remarqué ? <span className="text-slate-500 font-normal">(optionnel)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {QUICK_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-sm'
                          : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Written Comment */}
            <div>
              <label htmlFor="user-comment" className="block text-sm font-semibold text-slate-200 mb-2 flex items-center justify-between">
                <span>3. Votre commentaire ou suggestion : <span className="text-slate-500 font-normal">(optionnel)</span></span>
                <span className="text-xs text-slate-500">Ce qui a fait « tilt » ou vos remarques</span>
              </label>
              <textarea
                id="user-comment"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={`« Sur ${conceptTitle}, j'ai particulièrement compris... »`}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition"
              />
            </div>

            {/* 4. Identity Section (Anonyme vs Prénom/Email) */}
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Mode de publication
                </span>
                
                {/* Switcher Anonyme / Nominatif */}
                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setIsAnonymous(true)}
                    className={`px-2.5 py-1 rounded-md transition cursor-pointer font-medium ${
                      isAnonymous 
                        ? 'bg-slate-800 text-white border border-slate-700 shadow-xs' 
                        : 'text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    100% Anonyme
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAnonymous(false)}
                    className={`px-2.5 py-1 rounded-md transition cursor-pointer font-medium ${
                      !isAnonymous 
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-xs' 
                        : 'text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    Prénom / Email (optionnel)
                  </button>
                </div>
              </div>

              {isAnonymous ? (
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  Aucune information personnelle requise : votre avis sera enregistré sous « Apprenant anonyme ».
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1 flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-500" /> Prénom ou pseudo
                    </label>
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Ex: Thomas, Sarah..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1 flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-500" /> Email (optionnel, pour être tenu informé)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre.email@exemple.com"
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-slate-500">
                {rating === 0 ? '💡 Sélectionnez au moins une étoile pour valider' : 'Prêt à être envoyé !'}
              </p>
              <button
                type="submit"
                disabled={rating === 0}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition cursor-pointer ${
                  rating > 0 
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20 active:scale-95' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
                Enregistrer mon avis
              </button>
            </div>
          </form>
        ) : (
          /* Confirmation State */
          <div className="mt-6 p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  Merci pour votre retour !
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                    {rating} / 5 ⭐
                  </span>
                </h4>
                <p className="text-sm text-slate-300 mt-1">
                  Votre avis est précieux pour affiner chaque détail de la leçon.
                </p>
              </div>
            </div>

            <button
              onClick={handleResetReview}
              className="text-xs font-medium text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 transition cursor-pointer shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Modifier mon avis
            </button>
          </div>
        )}

        {/* Real Reviews Section */}
        <div className="mt-8 pt-6 border-t border-slate-800/60">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
              Avis enregistrés sur cette notion ({allReviews.length})
            </h4>
          </div>

          {allReviews.length === 0 ? (
            <div className="p-4 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-500">
              Aucun avis n'a encore été déposé pour cet exercice. Soyez le premier à partager votre retour !
            </div>
          ) : (
            <div className="space-y-3">
              {allReviews.map((rev) => (
                <div 
                  key={rev.id} 
                  className="p-4 rounded-xl border text-sm transition bg-slate-900/90 border-amber-500/30 ring-1 ring-amber-500/20"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-200 text-xs">
                        {rev.authorName}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-medium">
                        Votre avis
                      </span>
                      <span className="text-[11px] text-slate-500">· {rev.date}</span>
                    </div>

                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  {rev.comment && (
                    <p className="text-xs text-slate-300 leading-relaxed mt-1">
                      « {rev.comment} »
                    </p>
                  )}

                  {rev.tags && rev.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {rev.tags.map((t) => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 border border-slate-800">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
