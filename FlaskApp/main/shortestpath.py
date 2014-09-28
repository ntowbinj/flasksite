import json
import urllib2


def shortest_path_neo(a, b):
    c = "precise"
    a = g.conn.get_indexed_node("worddex", "word", a)
    b = g.conn.get_indexed_node("worddex", "word", b)
    c = g.conn.get_indexed_node("worddex", "word", c)
    if not a and b: return None
    print("before")
    query_string = "START beginning=node(%d), end=node(%d) MATCH p = shortestPath(beginning-[*..100]-end) RETURN p" % (a._id, b._id)
    result = neo4j.CypherQuery(g.conn, query_string).execute()
    print("after")
    print("length: %d" % (len(result)))
    if not len(result): return None
    p = result[0].p
    ret = []
    for node in p.nodes:
        ret.append(node["word"])
    return ret

def shortest_path(form):
    data = form.items()[0][0]
    header = {'Content-Type': 'application/json'}
    request = urllib2.Request("http://localhost:8080/demo", data, header) 
    response = urllib2.urlopen(request)
    ret = response.read()
    return ret 


