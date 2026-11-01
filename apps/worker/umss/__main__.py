"""Punto de entrada: ``python -m umss``.

Hasta que llegue el motor (SPRINT-07) solo informa la versión y termina sin error, para que la
imagen del worker se pueda construir y probar.
"""

from umss import __version__


def main() -> int:
    """Imprime la versión del paquete y devuelve el código de salida."""
    print(f"umss {__version__}: motor de agentes pendiente de incorporar (SPRINT-07).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
