content = open('REVISÃO.md').read()
import re
print("Analise block titles:")
for line in content.split('\n'):
    if line.startswith('**Análise d'):
        print(line)
