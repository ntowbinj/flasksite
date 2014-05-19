from trie import Trie

t = Trie()
t.read_json('thesaurus.json')

index = 0
stack = []
components = []

def strong_connect(v):
    global index
    v.index = index
    v.low_link = index
    index += 1
    stack.append(v)
    v.on_stack = True

    for w in v.neighbs:
        if not w.index:
            strong_connect(w)
            v.low_link = min(v.low_link, w.low_link)
        elif w.on_stack: v.low_link = min(v.low_link, w.index)

    if v.low_link == v.index:
        comp = []
        while True:
            w = stack.pop()
            w.on_stack = False
            comp.append(w)
            if v == w: 
                components.append(comp)
                break

for v in t.iterator():
    if not v.index:
        strong_connect(v)


def strong_connect_flat(root):
    global index
    stack.append(root)
    i = 0
    while i<len(stack):
        v = stack[i]
        v.on_stack = True
        v.index = index
        v.low_link = index
        index += 1
        for w in v.neighbs:
            if not w.index:
                w.previous = v
                stack.append(w)
            elif w.on_stack: v.low_link = min(v.low_link, w.index)
        i += 1
    while len(stack)
        

