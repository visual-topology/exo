if __name__ == '__main__':
    import re
    exp = re.compile(r"\s*([^\s=]+)\s*(?:=\s*'([^']*)'|=\s*\"([^\"]*)\")")
    print(exp.match("a='b'").group(2))
    print(exp.match('a="b"').group(2))