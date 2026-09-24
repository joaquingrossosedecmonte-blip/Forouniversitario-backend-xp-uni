Feature: Comentar una publicación
  Como estudiante
  Quiero comentar una publicación
  Para poder participar en las discusiones del foro

  Scenario: Comentar una publicación correctamente
    Given que existe una publicación para comentar
    When el estudiante comenta la publicación con el contenido "Estoy de acuerdo con esta publicación"
    Then el comentario debe crearse correctamente
    And la respuesta del comentario debe tener código 201

  Scenario: Rechazar comentario sin contenido
    Given que existe una publicación para comentar
    When el estudiante intenta comentar la publicación sin contenido
    Then el comentario debe ser rechazado
    And la respuesta del comentario debe tener código 400

  Scenario: Rechazar comentario sobre una publicación inexistente
    Given que no existe la publicación con id 999
    When el estudiante intenta comentar la publicación inexistente con el contenido "Comentario de prueba"
    Then el comentario debe ser rechazado
    And la respuesta del comentario debe tener código 404