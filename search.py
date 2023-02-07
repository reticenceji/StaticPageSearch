import re
from bs4 import BeautifulSoup
import json
from pathlib import Path
from collections import deque

# 将root改成您存放html文件的目录
root = Path(".")

# 扫描html文件
def scanfile(path: Path, content) -> dict:
    htmlcontent = BeautifulSoup(content, 'html.parser')
    # 将p, h2, h3, h4的内容，去除符号之后作为搜索内容
    textlist = "".join(
        map(lambda p: re.sub(u"([^\u4e00-\u9fa5\u0030-\u0039\u0041-\u005a\u0061-\u007a])", "", p.get_text()),
            htmlcontent.find_all(name=['p', 'h2', 'h3', 'h4'])))
    # 以h1或者文件名作为标题
    title = htmlcontent.find(name="h1")
    title = title.get_text() if title else path.stem
    return {
        "title": title,
        "path": path.relative_to(root).__str__(),
        "text": textlist
    }


if __name__ == "__main__":
    j = []
    target = deque([root])  # type: deque[Path]

    # 递归的遍历文件夹下所有的html文件
    while len(target) > 0:
        file = target.pop()
        if file.is_dir():
            target.extend(file.iterdir())
        elif file.is_file() and file.suffix == ".html":
            j.append(scanfile(file, file.read_bytes()))

    # 将最后的扫描结果和search.js输出到searcher.js
    # html文件中应该包含searcher.js
    with open("searcher.js", "w") as output:
        with open("search.js", "r") as input:
            output.write("let SearchResult = '"+json.dumps(j)+"';\n")
            output.write(input.read())
