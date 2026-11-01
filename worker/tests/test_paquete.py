"""Prueba de humo del paquete ``umss`` (T-12)."""

import pytest

import umss
from umss.__main__ import main


def test_expone_la_version() -> None:
    assert umss.__version__ == "0.1.0"


def test_main_informa_la_version_y_termina_bien(capsys: pytest.CaptureFixture[str]) -> None:
    assert main() == 0
    assert "umss 0.1.0" in capsys.readouterr().out
