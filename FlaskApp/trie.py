import json
from collections import deque


class Trie:
    def __init__(self):
        self.is_word = False
        self.children = {}
        self.node = None
        self.on_stack = False
    def add(self, word, fullword=''):
        if not len(word): 
            self.is_word = True
            if not self.node: 
                self.node = Node(word=fullword)
            return self.node
        else: 
            if not word[0] in self.children: self.children[word[0]] = Trie()
            return self.children[word[0]].add(word[1:], fullword + word[0])

    def get(self, word):
        if not len(word): 
            if self.is_word: return self.node
            else: return None
        else:
            if not word[0] in self.children: return None
            return self.children[word[0]].get(word[1:])

    def iterator(self, word=''):
        if self.is_word: yield self.node
        for k in self.children:
            for w in self.children[k].iterator(word=word + k):
                yield w

    def write_json(self, filename):
        comma = False
        with open(filename, 'w') as writer:
            writer.write('{\n')
            for n in self.iterator():
                if comma: writer.write(',')
                comma = True
                writer.write(n.to_json())
            writer.write('}\n')

    def read_json(self, filename):
        with open(filename, 'rb') as reader:
            j = json.loads(reader.read())
            for k in j:
                node = self.add(k)
                for neighb in j[k]:
                    neighb = self.add(neighb)
                    if neighb not in node.neighbs: node.neighbs.append(neighb)
                    


class Node:
    def __init__(self, word='word'):
        self.word = word
        self.neighbs = []
        self.visited = False
        self.previous = None
        self.index = None
        self.low_link = None
    def to_json(self):
        ret = '"' + self.word + '"' + ': [\n '
        comma = False
        for n in self.neighbs:
            if comma: ret = ret + ',\n'
            comma = True
            ret = ret + '"%s"' % (n.word)
        ret = ret + '\n]\n'
        return ret
    def show_neighbors(self):
        ret = []
        for n in self.neighbs:
            ret.append(n.word)
        return ret

    def shortest_path(self, dest, limit=100):
        q = deque([self])
        curr = None
        while len(q) and limit:
            curr = q.popleft()
            curr.visited = True
            if curr.word==dest.word: 
                while len(q):
                    q.popleft().visited = False
                print(curr.word + " " + dest.word)
                print("broke")
                break
            for n in curr.neighbs:
                if not n.visited:
                    q.append(n)
                    if not n.previous:
                        n.previous = curr
        if not limit or not curr.word == dest.word: 
            print(curr.word + " " + dest.word)
            return None
        ret = []
        while curr:
            ret.append(curr)
            curr.visited = False
            curr = curr.previous
        return map(lambda n: n.word, reversed(ret))
            

