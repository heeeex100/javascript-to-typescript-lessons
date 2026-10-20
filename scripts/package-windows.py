"""维护者打包命令：python3 scripts/package-windows.py。学习者运行课程不需要 Python。"""
from pathlib import Path
import hashlib
import zipfile

root = Path(__file__).resolve().parent.parent
folders = ("answers", "checks", "challenges", "examples", "exercises", "lessons", "practice", "project", "reference", "scripts", "workshop")
names = ("README.md", "Windows使用说明.md", "学习检查记录.md", "CONTRIBUTING.md", "package.json", "package-lock.json", "tsconfig.json", ".gitignore", ".gitattributes", "start-workshop.cmd", "setup-typescript.cmd")
files = [root / name for name in names]
for folder in folders:
    files.extend(p for p in (root / folder).rglob("*") if p.is_file() and not p.is_symlink()
                 and p.name != ".DS_Store" and not p.is_relative_to(root / "practice" / "concepts")
                 and not any(part.startswith(".") or part == "__pycache__" for part in p.relative_to(root / folder).parts))
output = root / "exports"
output.mkdir(exist_ok=True)
archive = output / "typescript-windows-latest.zip"
with zipfile.ZipFile(archive, "w", zipfile.ZIP_DEFLATED) as package:
    for file in sorted(files):
        package.write(file, Path("typescript-course") / file.relative_to(root))
with zipfile.ZipFile(archive) as package:
    if package.testzip() is not None:
        raise RuntimeError("压缩包完整性检查失败")
checksum = hashlib.sha256(archive.read_bytes()).hexdigest()
archive.with_suffix(".sha256").write_text(f"{checksum}  {archive.name}\n", encoding="utf-8")
print(f"{archive.name}: {len(files)} 个文件，{archive.stat().st_size} 字节；SHA256 已保存。")
