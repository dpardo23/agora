-- dpardo · semilla de la oficina (distribución actual de Main.dc.html, escena 960×720, planta 1)
-- Las salas del diseño objetivo de 2 plantas (docs/CONTEXTO.md §7.2) se agregan en una migración posterior.

insert into oficina_salas (id, nombre, planta, tipo, x, y, w, h, capacidad) values
  ('despacho',  'Despacho',        1, 'trabajo',   0,   0, 440, 256, 1),
  ('trabajo',   'Sala de trabajo', 1, 'trabajo', 454,   0, 496, 326, 6),
  ('biblioteca','Biblioteca',      1, 'trabajo',   0, 262, 284, 158, 2),
  ('descanso',  'Descanso',        1, 'estado',    0, 426, 300, 294, null),
  ('reuniones', 'Reuniones',       1, 'estado',  606, 406, 344, 314, 8),
  ('recepcion', 'Recepción',       1, 'trabajo', 380, 560, 200, 120, 1);

insert into agentes (id, nombre, rol, sala_id, escritorio, motor, estado, sprite, orden) values
  ('ctl','Control maestro','Recibe encargos, planifica, genera el esquema, reparte cada paso y vigila el cupo de 5 horas.','despacho',0,'claude','trabajando','{"color":"navy","pos":[197,56]}',0),
  ('inv','Investigador','Busca y descarga fuentes con Chromium, arma consultas en español e inglés y limpia la bibliografía por DOI.','trabajo',0,'gemini_flash','trabajando','{"color":"cielo","pos":[532,98]}',1),
  ('fic','Fichador','Extrae pasajes literales de las fuentes y guarda sus embeddings en pgvector.','trabajo',1,'gemini_flash','esperando','{"color":"cielo","pos":[682,98]}',2),
  ('red','Redactor','Escribe cada sección apoyándose solo en las fichas; toda afirmación lleva cita verificable.','trabajo',2,'claude','trabajando','{"color":"rosa","pos":[832,98]}',3),
  ('ver','Verificador','Comprueba cada cita literal contra su fuente y aplica la barrera de entrega.','trabajo',3,'python','esperando','{"color":"menta","pos":[562,218]}',4),
  ('maq','Maquetador','Compila el LaTeX con las recetas de errores; si no hay receta, consulta a Gemini.','trabajo',4,'texlive','libre','{"color":"rosa","pos":[712,218]}',5),
  ('ilu','Ilustrador','Genera diagramas, figuras y portadas para los documentos.','trabajo',5,'imagenes','trabajando','{"color":"mant","pos":[862,218]}',6),
  ('tut','Tutor','Convierte cada documento entregado en tarjetas de repaso y quizzes.','biblioteca',0,'gemini_flash','trabajando','{"color":"mant","pos":[56,316]}',7),
  ('arc','Archivista','Entrega los PDF en las carpetas de Google Drive de cada materia.','biblioteca',1,'drive_api','libre','{"color":"menta","pos":[182,316]}',8),
  ('car','Cartero','Trae avisos de Gmail y de las webs UMSS y FCyT, y envía recordatorios.','recepcion',0,'n8n','trabajando','{"color":"lila","pos":[422,584]}',9);

-- Plan de estudios: pendiente de importar el plan oficial (docs/CONTEXTO.md §13).
