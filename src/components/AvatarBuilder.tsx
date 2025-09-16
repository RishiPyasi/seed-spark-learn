import { Button } from '@/components/ui/button';
import { Avatar as AvatarType } from '@/types';

interface AvatarBuilderProps {
  avatar: AvatarType;
  onChange: (avatar: AvatarType) => void;
  className?: string;
}

const AVATAR_OPTIONS = {
  skinTones: ['#F5DEB3', '#DEB887', '#D2B48C', '#CD853F', '#8B4513', '#654321'],
  hairStyles: ['short', 'long', 'curly', 'braids', 'bald', 'ponytail', 'afro', 'mohawk'],
  hairColors: ['#8B4513', '#000000', '#FFD700', '#FF4500', '#4B0082', '#008000', '#FF69B4', '#FF0000'],
  eyeColors: ['#8B4513', '#000000', '#0000FF', '#008000', '#808080', '#FFA500', '#800080', '#006400'],
  eyeShapes: ['round', 'almond', 'hooded', 'monolid', 'upturned', 'downturned'],
  faceShapes: ['oval', 'round', 'square', 'heart', 'diamond', 'oblong'],
  outfits: ['casual', 'formal', 'eco-warrior', 'scientist', 'gardener', 'explorer', 'student', 'teacher'],
  accessories: ['glasses', 'hat', 'earrings', 'necklace', 'backpack', 'watch', 'scarf', 'none'],
  facialHair: ['none', 'mustache', 'beard', 'goatee', 'stubble'],
  expressions: ['happy', 'neutral', 'excited', 'focused', 'friendly', 'determined']
};

export const AvatarBuilder = ({ avatar, onChange, className }: AvatarBuilderProps) => {
  const updateAvatar = (field: keyof AvatarType, value: string | string[]) => {
    onChange({ ...avatar, [field]: value });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Skin Tone */}
      <div>
        <h4 className="font-medium mb-3 text-foreground">Skin Tone</h4>
        <div className="flex gap-2 flex-wrap">
          {AVATAR_OPTIONS.skinTones.map((tone, index) => (
            <button
              key={index}
              className={`w-10 h-10 rounded-full border-3 transition-all hover:scale-110 ${
                avatar.skinTone === tone ? 'border-eco-leaf shadow-lg' : 'border-border'
              }`}
              style={{ backgroundColor: tone }}
              onClick={() => updateAvatar('skinTone', tone)}
            />
          ))}
        </div>
      </div>

      {/* Hair Style */}
      <div>
        <h4 className="font-medium mb-3 text-foreground">Hair Style</h4>
        <div className="grid grid-cols-3 gap-2">
          {AVATAR_OPTIONS.hairStyles.map((style) => (
            <Button
              key={style}
              size="sm"
              variant={avatar.hairStyle === style ? "default" : "outline"}
              onClick={() => updateAvatar('hairStyle', style)}
              className="capitalize"
            >
              {style}
            </Button>
          ))}
        </div>
      </div>

      {/* Hair Color */}
      <div>
        <h4 className="font-medium mb-3 text-foreground">Hair Color</h4>
        <div className="flex gap-2 flex-wrap">
          {AVATAR_OPTIONS.hairColors.map((color, index) => (
            <button
              key={index}
              className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                avatar.hairColor === color ? 'border-eco-leaf shadow-lg' : 'border-border'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => updateAvatar('hairColor', color)}
            />
          ))}
        </div>
      </div>

      {/* Eye Color */}
      <div>
        <h4 className="font-medium mb-3 text-foreground">Eye Color</h4>
        <div className="flex gap-2 flex-wrap">
          {AVATAR_OPTIONS.eyeColors.map((color, index) => (
            <button
              key={index}
              className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                avatar.eyeColor === color ? 'border-eco-leaf shadow-lg' : 'border-border'
              }`}
              style={{ backgroundColor: color }}
              onClick={() => updateAvatar('eyeColor', color)}
            />
          ))}
        </div>
      </div>

      {/* Face Shape */}
      <div>
        <h4 className="font-medium mb-3 text-foreground">Face Shape</h4>
        <div className="grid grid-cols-3 gap-2">
          {AVATAR_OPTIONS.faceShapes.map((shape) => (
            <Button
              key={shape}
              size="sm"
              variant={avatar.faceShape === shape ? "default" : "outline"}
              onClick={() => updateAvatar('faceShape', shape)}
              className="capitalize"
            >
              {shape}
            </Button>
          ))}
        </div>
      </div>

      {/* Outfit */}
      <div>
        <h4 className="font-medium mb-3 text-foreground">Outfit</h4>
        <div className="grid grid-cols-2 gap-2">
          {AVATAR_OPTIONS.outfits.map((outfit) => (
            <Button
              key={outfit}
              size="sm"
              variant={avatar.outfit === outfit ? "default" : "outline"}
              onClick={() => updateAvatar('outfit', outfit)}
              className="capitalize"
            >
              {outfit.replace('-', ' ')}
            </Button>
          ))}
        </div>
      </div>

      {/* Expression */}
      <div>
        <h4 className="font-medium mb-3 text-foreground">Expression</h4>
        <div className="grid grid-cols-3 gap-2">
          {AVATAR_OPTIONS.expressions.map((expression) => (
            <Button
              key={expression}
              size="sm"
              variant={avatar.expression === expression ? "default" : "outline"}
              onClick={() => updateAvatar('expression', expression)}
              className="capitalize"
            >
              {expression}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};