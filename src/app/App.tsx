import { useState, useRef } from 'react';
import noiseTexture from '@/assets/noise-texture.png';
import { Copy, Download, AlignLeft, AlignCenter, AlignRight, RotateCcw, Code2 } from 'lucide-react';
import { Button } from './components/ui/button';
import { Textarea } from './components/ui/textarea';
import { Slider } from './components/ui/slider';
import { Label } from './components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Separator } from './components/ui/separator';
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner';
import html2canvas from 'html2canvas';

const fontFamilies = [
  { name: 'Lobster', value: "'Lobster', cursive" },
  { name: 'Righteous', value: "'Righteous', cursive" },
  { name: 'Bebas Neue', value: "'Bebas Neue', cursive" },
  { name: 'Oswald', value: "'Oswald', sans-serif" },
  { name: 'Anton', value: "'Anton', sans-serif" },
  { name: 'Playfair Display', value: "'Playfair Display', serif" },
  { name: 'Abril Fatface', value: "'Abril Fatface', cursive" },
  { name: 'Fredoka One', value: "'Fredoka One', cursive" },
];

type EmbossPreset = {
  name: string;
  shadowOffset: number;
  shadowBlur: number;
  textOpacity: number;
  lightAngle: number;
};

const embossPresets: EmbossPreset[] = [
  { name: 'Subtle',   shadowOffset: 2,  shadowBlur: 6,  textOpacity: 15, lightAngle: 135 },
  { name: 'Classic',  shadowOffset: 3,  shadowBlur: 10, textOpacity: 20, lightAngle: 135 },
  { name: 'Deep',     shadowOffset: 5,  shadowBlur: 18, textOpacity: 25, lightAngle: 135 },
  { name: 'Metallic', shadowOffset: 3,  shadowBlur: 4,  textOpacity: 30, lightAngle: 120 },
  { name: 'Engraved', shadowOffset: 4,  shadowBlur: 8,  textOpacity: 35, lightAngle: 315 },
];

function buildEmbossShadow(lightAngle: number, shadowOffset: number, shadowBlur: number): string {
  const rad = (lightAngle * Math.PI) / 180;
  const dx = parseFloat((Math.cos(rad) * shadowOffset).toFixed(1));
  const dy = parseFloat((-Math.sin(rad) * shadowOffset).toFixed(1));
  const smallOffset = Math.max(0.5, shadowOffset / 3);
  const sdx = parseFloat((Math.cos(rad) * smallOffset).toFixed(1));
  const sdy = parseFloat((-Math.sin(rad) * smallOffset).toFixed(1));
  const smallBlur = Math.max(2, Math.round(shadowBlur / 4));
  return [
    `${dx}px ${dy}px ${shadowBlur}px rgba(0,0,0,0.3)`,
    `${-dx}px ${-dy}px ${shadowBlur}px rgba(96,96,96,0.6)`,
    `${sdx}px ${sdy}px ${smallBlur}px rgba(0,0,0,0.4)`,
  ].join(', ');
}

const defaults = {
  text: 'This is an\nembossing effect',
  fontSize: 70,
  letterSpacing: 0,
  lineHeight: 1.2,
  textAlign: 'center' as const,
  verticalPosition: 50,
  horizontalPosition: 50,
  backgroundColor: '#414141',
  textColor: '#3f3f3f',
  textOpacity: 20,
  fontFamily: fontFamilies[0].value,
  shadowOffset: 3,
  shadowBlur: 10,
  lightAngle: 135,
  noiseOpacity: 40,
};

export default function App() {
  const [text, setText] = useState(defaults.text);
  const [fontSize, setFontSize] = useState(defaults.fontSize);
  const [letterSpacing, setLetterSpacing] = useState(defaults.letterSpacing);
  const [lineHeight, setLineHeight] = useState(defaults.lineHeight);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>(defaults.textAlign);
  const [verticalPosition, setVerticalPosition] = useState(defaults.verticalPosition);
  const [horizontalPosition, setHorizontalPosition] = useState(defaults.horizontalPosition);
  const [backgroundColor, setBackgroundColor] = useState(defaults.backgroundColor);
  const [textColor, setTextColor] = useState(defaults.textColor);
  const [textOpacity, setTextOpacity] = useState(defaults.textOpacity);
  const [fontFamily, setFontFamily] = useState(defaults.fontFamily);
  const [shadowOffset, setShadowOffset] = useState(defaults.shadowOffset);
  const [shadowBlur, setShadowBlur] = useState(defaults.shadowBlur);
  const [lightAngle, setLightAngle] = useState(defaults.lightAngle);
  const [noiseOpacity, setNoiseOpacity] = useState(defaults.noiseOpacity);
  const previewRef = useRef<HTMLDivElement>(null);

  const textShadow = buildEmbossShadow(lightAngle, shadowOffset, shadowBlur);
  const embossStyle = {
    textShadow,
    color: `${textColor}${Math.round((textOpacity / 100) * 255).toString(16).padStart(2, '0')}`,
    fontFamily,
    fontSize: `${fontSize}px`,
    lineHeight: lineHeight.toString(),
    letterSpacing: `${letterSpacing}px`,
    textAlign,
  };

  const applyPreset = (preset: EmbossPreset) => {
    setShadowOffset(preset.shadowOffset);
    setShadowBlur(preset.shadowBlur);
    setTextOpacity(preset.textOpacity);
    setLightAngle(preset.lightAngle);
    toast.success(`Applied "${preset.name}" preset`);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    toast.success('Text copied to clipboard!');
  };

  const saveAsImage = async () => {
    if (!previewRef.current) return;
    try {
      toast.loading('Generating image...');
      const canvas = await html2canvas(previewRef.current, {
        backgroundColor,
        scale: 2,
      });
      const link = document.createElement('a');
      link.download = 'emboss-design.png';
      link.href = canvas.toDataURL();
      link.click();
      toast.dismiss();
      toast.success('Image saved!');
    } catch {
      toast.dismiss();
      toast.error('Failed to save image');
    }
  };

  const resetSettings = () => {
    setText(defaults.text);
    setFontSize(defaults.fontSize);
    setLetterSpacing(defaults.letterSpacing);
    setLineHeight(defaults.lineHeight);
    setTextAlign(defaults.textAlign);
    setVerticalPosition(defaults.verticalPosition);
    setHorizontalPosition(defaults.horizontalPosition);
    setBackgroundColor(defaults.backgroundColor);
    setTextColor(defaults.textColor);
    setTextOpacity(defaults.textOpacity);
    setFontFamily(defaults.fontFamily);
    setShadowOffset(defaults.shadowOffset);
    setShadowBlur(defaults.shadowBlur);
    setLightAngle(defaults.lightAngle);
    setNoiseOpacity(defaults.noiseOpacity);
    toast.success('Settings reset to defaults!');
  };

  const copyCSS = () => {
    const css = `text-shadow: ${embossStyle.textShadow};
color: ${embossStyle.color};
font-family: ${embossStyle.fontFamily};
font-size: ${embossStyle.fontSize};
line-height: ${embossStyle.lineHeight};
letter-spacing: ${embossStyle.letterSpacing};
text-align: ${embossStyle.textAlign};`;
    navigator.clipboard.writeText(css);
    toast.success('CSS copied to clipboard!');
  };

  return (
    <div className="relative size-full flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Toaster />

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#ffffff]">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white">
            <span className="text-2xl font-bold text-[#040c5b]" style={{ fontFamily: "'Figtree', sans-serif" }}>
              E
            </span>
          </div>
          <h1 className="text-xl font-bold text-[#040c5b]" style={{ fontFamily: "'Figtree', sans-serif" }}>
            EMBOSS YOUR SHIT
          </h1>
        </div>
        <Button onClick={saveAsImage} variant="default" size="sm" className="bg-[#ffffff] hover:bg-[#ffffff]/90 text-[#040c5b]">
          <Download className="w-4 h-4 mr-2" />
          Save Image
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Controls Panel */}
        <div className="w-80 border-r border-white/10 bg-[#ffffff] overflow-y-auto">
          <div className="p-6 space-y-6">

            {/* PRESETS */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-[#040c5b] uppercase tracking-wide">Presets</h3>
              <div className="grid grid-cols-3 gap-1.5">
                {embossPresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className="h-8 rounded text-xs font-medium text-[#040c5b] bg-[#040c5b]/5 hover:bg-[#040c5b]/15 transition-colors"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <Separator className="bg-[#040c5b]/10" />

            {/* TEXT */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-[#040c5b] uppercase tracking-wide">Text</h3>
              <div className="space-y-2">
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter your text here..."
                  className="min-h-[80px] bg-white/5 border-[#040c5b]/20 text-[#040c5b] placeholder:text-[#040c5b]/50 resize-none text-sm"
                />
                <Button onClick={copyToClipboard} variant="ghost" size="sm" className="w-full text-[#040c5b] hover:text-[#040c5b] hover:bg-[#040c5b]/5 h-8 text-xs">
                  <Copy className="w-3 h-3 mr-2" />
                  Copy Text
                </Button>
              </div>
            </div>

            <Separator className="bg-[#040c5b]/10" />

            {/* TYPOGRAPHY */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-[#040c5b] uppercase tracking-wide">Typography</h3>

              <div className="space-y-2">
                <Label className="text-[#040c5b] text-sm">Font Family</Label>
                <Select value={fontFamily} onValueChange={setFontFamily}>
                  <SelectTrigger className="w-full h-9 text-sm">
                    <SelectValue>{fontFamilies.find(f => f.value === fontFamily)?.name}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {fontFamilies.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        <span style={{ fontFamily: font.value }}>{font.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-[#040c5b] text-sm">Font Size</Label>
                  <span className="text-xs text-[#040c5b]/70 font-mono">{fontSize}px</span>
                </div>
                <Slider value={[fontSize]} onValueChange={(v) => setFontSize(v[0])} min={20} max={200} step={1} className="py-1" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-[#040c5b] text-sm">Tracking</Label>
                  <span className="text-xs text-[#040c5b]/70 font-mono">{letterSpacing}px</span>
                </div>
                <Slider value={[letterSpacing]} onValueChange={(v) => setLetterSpacing(v[0])} min={-5} max={20} step={0.5} className="py-1" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-[#040c5b] text-sm">Line Height</Label>
                  <span className="text-xs text-[#040c5b]/70 font-mono">{lineHeight.toFixed(1)}</span>
                </div>
                <Slider value={[lineHeight]} onValueChange={(v) => setLineHeight(v[0])} min={0.8} max={3} step={0.1} className="py-1" />
              </div>

              <div className="space-y-2">
                <Label className="text-[#040c5b] text-sm">Alignment</Label>
                <div className="flex gap-1 w-full">
                  {(['left', 'center', 'right'] as const).map((align) => (
                    <Button
                      key={align}
                      onClick={() => setTextAlign(align)}
                      variant="ghost"
                      className={`h-9 flex-1 text-[#040c5b] hover:bg-[#040c5b]/10 ${textAlign === align ? 'bg-[#040c5b]/10' : ''}`}
                    >
                      {align === 'left'   && <AlignLeft className="w-4 h-4" />}
                      {align === 'center' && <AlignCenter className="w-4 h-4" />}
                      {align === 'right'  && <AlignRight className="w-4 h-4" />}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <Separator className="bg-[#040c5b]/10" />

            {/* EMBOSS */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-[#040c5b] uppercase tracking-wide">Emboss</h3>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-[#040c5b] text-sm">Light Angle</Label>
                  <span className="text-xs text-[#040c5b]/70 font-mono">{lightAngle}°</span>
                </div>
                <Slider value={[lightAngle]} onValueChange={(v) => setLightAngle(v[0])} min={0} max={360} step={5} className="py-1" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-[#040c5b] text-sm">Shadow Depth</Label>
                  <span className="text-xs text-[#040c5b]/70 font-mono">{shadowOffset}px</span>
                </div>
                <Slider value={[shadowOffset]} onValueChange={(v) => setShadowOffset(v[0])} min={0.5} max={12} step={0.5} className="py-1" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-[#040c5b] text-sm">Shadow Blur</Label>
                  <span className="text-xs text-[#040c5b]/70 font-mono">{shadowBlur}px</span>
                </div>
                <Slider value={[shadowBlur]} onValueChange={(v) => setShadowBlur(v[0])} min={0} max={30} step={1} className="py-1" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-[#040c5b] text-sm">Text Opacity</Label>
                  <span className="text-xs text-[#040c5b]/70 font-mono">{textOpacity}%</span>
                </div>
                <Slider value={[textOpacity]} onValueChange={(v) => setTextOpacity(v[0])} min={0} max={100} step={1} className="py-1" />
              </div>
            </div>

            <Separator className="bg-[#040c5b]/10" />

            {/* POSITION */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-[#040c5b] uppercase tracking-wide">Position</h3>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-[#040c5b] text-sm">X Position</Label>
                  <span className="text-xs text-[#040c5b]/70 font-mono">{horizontalPosition}%</span>
                </div>
                <Slider value={[horizontalPosition]} onValueChange={(v) => setHorizontalPosition(v[0])} min={0} max={100} step={1} className="py-1" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-[#040c5b] text-sm">Y Position</Label>
                  <span className="text-xs text-[#040c5b]/70 font-mono">{verticalPosition}%</span>
                </div>
                <Slider value={[verticalPosition]} onValueChange={(v) => setVerticalPosition(v[0])} min={0} max={100} step={1} className="py-1" />
              </div>
            </div>

            <Separator className="bg-[#040c5b]/10" />

            {/* STYLE */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-[#040c5b] uppercase tracking-wide">Style</h3>

              <div className="space-y-2">
                <Label className="text-[#040c5b] text-sm">Background</Label>
                <div className="flex items-center gap-2">
                  <input type="color" value={backgroundColor} onChange={(e) => setBackgroundColor(e.target.value)} className="h-9 w-14 rounded border border-[#040c5b]/20 cursor-pointer" />
                  <span className="text-xs text-[#040c5b]/70 font-mono flex-1">{backgroundColor}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[#040c5b] text-sm">Text Color</Label>
                <div className="flex items-center gap-2">
                  <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="h-9 w-14 rounded border border-[#040c5b]/20 cursor-pointer" />
                  <span className="text-xs text-[#040c5b]/70 font-mono flex-1">{textColor}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-[#040c5b] text-sm">Noise Opacity</Label>
                  <span className="text-xs text-[#040c5b]/70 font-mono">{noiseOpacity}%</span>
                </div>
                <Slider value={[noiseOpacity]} onValueChange={(v) => setNoiseOpacity(v[0])} min={0} max={100} step={1} className="py-1" />
              </div>
            </div>

            <Separator className="bg-[#040c5b]/10" />

            {/* ACTIONS */}
            <div className="space-y-2">
              <Button onClick={copyCSS} variant="outline" size="sm" className="w-full text-[#040c5b] hover:bg-[#040c5b]/5 h-9 text-xs">
                <Code2 className="w-3.5 h-3.5 mr-2" />
                Copy CSS Code
              </Button>
              <Button onClick={resetSettings} variant="ghost" size="sm" className="w-full text-[#040c5b]/60 hover:text-[#040c5b] hover:bg-[#040c5b]/5 h-9 text-xs">
                <RotateCcw className="w-3.5 h-3.5 mr-2" />
                Reset All Settings
              </Button>
            </div>

          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 relative overflow-hidden">
          <div ref={previewRef} className="absolute inset-0" style={{ backgroundColor }}>
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url('${noiseTexture}')`,
                backgroundSize: '178.5px 252.6px',
                backgroundPosition: 'top left',
                opacity: noiseOpacity / 100,
              }}
            />
            <div className="relative size-full">
              <div
                style={{
                  ...embossStyle,
                  position: 'absolute',
                  left: `${horizontalPosition}%`,
                  top: `${verticalPosition}%`,
                  transform: 'translate(-50%, -50%)',
                  width: '80%',
                  maxWidth: '1200px',
                }}
                className="whitespace-pre-wrap"
              >
                {text}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
