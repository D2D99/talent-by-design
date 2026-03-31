import sys

def count_tags(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    divs = content.count('<div')
    slash_divs = content.count('</div')
    
    fragments = content.count('<>')
    slash_fragments = content.count('</>')
    
    print(f"<div>: {divs}")
    print(f"</div>: {slash_divs}")
    print(f"<>: {fragments}")
    print(f"</>: {slash_fragments}")

if __name__ == "__main__":
    count_tags(sys.argv[1])
