// Shared Tailwind config — imported by each page inline
window.__TW_CONFIG__ = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "background":"#111412","on-background":"#e2e3df",
        "surface":"#111412","surface-dim":"#111412","surface-bright":"#373a37",
        "surface-container-lowest":"#0c0f0d","surface-container-low":"#1a1c1a",
        "surface-container":"#1e201e","surface-container-high":"#282b28",
        "surface-container-highest":"#333533","surface-variant":"#333533",
        "on-surface":"#e2e3df","on-surface-variant":"#c4c6cc",
        "outline":"#8e9196","outline-variant":"#44474c",
        "primary":"#bac8dc","on-primary":"#243141",
        "primary-container":"#0d1b2a","on-primary-container":"#768497",
        "secondary":"#e6c364","on-secondary":"#3d2e00",
        "secondary-container":"#785d00","on-secondary-container":"#fdd977",
        "tertiary":"#bbc6e2","on-tertiary":"#263046",
        "tertiary-container":"#0f1a2e","on-tertiary-container":"#78839c",
        "error":"#ffb4ab","on-error":"#690005",
        "error-container":"#93000a","on-error-container":"#ffdad6"
      },
      borderRadius:{DEFAULT:'0.125rem',lg:'0.25rem',xl:'0.5rem',full:'0.75rem'},
      spacing:{'margin-mobile':'16px','gutter':'24px','container-max':'1200px','margin-desktop':'64px','unit':'8px'},
      fontFamily:{
        'display-lg':['Amiri','serif'],
        'headline-lg':["'Noto Serif'",'serif'],
        'body-lg':["'Source Serif 4'",'serif'],
        'label-sm':["'Source Sans 3'",'sans-serif']
      },
      fontSize:{
        'display-lg':['48px',{lineHeight:'1.2',fontWeight:'700',letterSpacing:'-0.02em'}],
        'headline-lg':['32px',{lineHeight:'1.3',fontWeight:'600'}],
        'body-lg':['18px',{lineHeight:'1.8',fontWeight:'400'}]
      }
    }
  }
};
tailwind.config = window.__TW_CONFIG__;
