const ATAScoreBadge = ({ score, size = 'md' }) => {
  const getScoreColor = () => {
    if (score >= 85) return { bg: 'from-pepper-green-light to-pepper-green', text: 'text-pepper-green-light', ring: 'ring-pepper-green/30' };
    if (score >= 70) return { bg: 'from-pepper-gold-light to-pepper-gold', text: 'text-pepper-gold-light', ring: 'ring-pepper-gold/30' };
    if (score >= 50) return { bg: 'from-orange-500 to-amber-500', text: 'text-orange-400', ring: 'ring-orange-500/30' };
    return { bg: 'from-pepper-red-light to-pepper-red', text: 'text-pepper-red-light', ring: 'ring-pepper-red/30' };
  };

  const getLabel = () => {
    if (score >= 85) return { emoji: '🌶️🌶️🌶️', label: 'Pepper Hot' };
    if (score >= 70) return { emoji: '🌶️🌶️', label: 'Still Hot' };
    if (score >= 50) return { emoji: '🌶️', label: 'Mild' };
    return { emoji: '❌', label: 'Dry Pepper' };
  };

  const colors = getScoreColor();
  const label = getLabel();

  const sizes = {
    sm: { wrapper: 'w-10 h-10', text: 'text-xs', labelSize: 'text-[9px]' },
    md: { wrapper: 'w-14 h-14', text: 'text-base', labelSize: 'text-[10px]' },
    lg: { wrapper: 'w-20 h-20', text: 'text-2xl', labelSize: 'text-xs' },
    xl: { wrapper: 'w-28 h-28', text: 'text-3xl', labelSize: 'text-sm' },
  };

  const s = sizes[size] || sizes.md;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`${s.wrapper} relative rounded-full flex items-center justify-center ring-2 ${colors.ring}`}>
        {/* Background gradient ring */}
        <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${colors.bg} opacity-15`} />
        {/* Score number */}
        <span className={`${s.text} font-bold ${colors.text} relative z-10`}>
          {score || 0}
        </span>
      </div>
      {size !== 'sm' && (
        <div className="flex flex-col items-center">
          <span className={s.labelSize}>{label.emoji}</span>
          {(size === 'lg' || size === 'xl') && (
            <span className={`${s.labelSize} text-pepper-muted mt-0.5`}>{label.label}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default ATAScoreBadge;
