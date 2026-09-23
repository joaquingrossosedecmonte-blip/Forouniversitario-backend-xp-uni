Feature: Crear publicación
  Como estudiante
  Quiero crear una publicación en el foro
  Para compartir información y generar discusiones con otros estudiantes

  Scenario: Crear una publicación correctamente
    Given que existe un usuario registrado para crear publicaciones
    When el estudiante crea una publicación con título "Mi primera publicación" y contenido "Este es el contenido de mi publicación"
    Then la publicación debe crearse correctamente
    And la respuesta de la publicación debe tener código 201

  Scenario: Rechazar publicación sin título
    Given que existe un usuario registrado para crear publicaciones
    When el estudiante intenta crear una publicación sin título y con contenido "Este es el contenido de mi publicación"
    Then la publicación debe ser rechazada
    And la respuesta de la publicación debe tener código 400

  Scenario: Rechazar publicación sin contenido
    Given que existe un usuario registrado para crear publicaciones
    When el estudiante intenta crear una publicación con título "Mi primera publicación" y sin contenido
    Then la publicación debe ser rechazada
    And la respuesta de la publicación debe tener código 400