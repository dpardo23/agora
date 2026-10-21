// Reglas de commits de Olympus (CONTRIBUTING.md, sección 2).
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert']],
    'scope-enum': [2, 'always', [
      'web', 'api', 'ui', 'olimpo', 'encargos', 'consumo', 'auth', 'cuenta', 'materias', 'malla', 'agenda',
      'tareas', 'avisos', 'estudio', 'inicio', 'pwa', 'db', 'worker', 'n8n', 'infra', 'design', 'producto',
      'qa', 'adr', 'ci', 'deps', 'repo',
    ]],
    'scope-empty': [2, 'never'],
    // Empieza en minúscula; se permiten identificadores en mayúscula dentro (HU-05.08, BUG-004).
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 72],
    'body-max-line-length': [2, 'always', 100],
    'footer-max-line-length': [2, 'always', 100],
  },
};
