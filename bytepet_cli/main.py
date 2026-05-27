"""Run the bundled bytepet Node.js CLI from a Python console script."""

from __future__ import annotations

import shutil
import subprocess
import sys
from pathlib import Path


def main() -> int:
    node = shutil.which("node")
    if node is None:
        print("bytepet-cli requires Node.js to run. Install Node.js and try again.", file=sys.stderr)
        return 1

    script = Path(__file__).resolve().parent / "bin" / "byte.js"
    if not script.exists():
        print(f"Bundled CLI script not found: {script}", file=sys.stderr)
        return 1

    return subprocess.call([node, str(script), *sys.argv[1:]])


if __name__ == "__main__":
    raise SystemExit(main())
