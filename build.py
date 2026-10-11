"""Build the standalone GitHub Pages game. Requires Python 3.9+, no packages."""
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / 'src'
SCRIPTS = (
    'unification-engine.js',
    'unification-politics.js',
    'unification-presidency.js',
    'unification-regions.js',
    'unification-guidance.js',
    'unification-ui.js',
)

styles = (SOURCE / 'onboarding.css').read_text(encoding='utf-8')
fragment = (SOURCE / 'layout.html').read_text(encoding='utf-8').replace('</style>', styles + '\n</style>') + '<script>\n'
fragment += '\n'.join((SOURCE / name).read_text(encoding='utf-8') for name in SCRIPTS)
fragment += '\n</script>\n'
assert not any(character in fragment for character in '\u00b7\u2022\u2219\u22c5')
template = (SOURCE / 'page-template.html').read_text(encoding='utf-8')
assert template.count('__FIRST_TERM_FRAGMENT__') == 1
document = template.replace('__FIRST_TERM_FRAGMENT__', escape(fragment))
with (ROOT / 'index.html').open('w', encoding='utf-8', newline='\n') as output:
    output.write(document)
print(f'Built index.html ({len(document.encode("utf-8")):,} bytes)')
