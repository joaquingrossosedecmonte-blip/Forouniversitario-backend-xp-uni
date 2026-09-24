Feature: Administrar publicaciones
  Como administrador
  Quiero eliminar una publicación reportada
  Para mantener el foro libre de contenido inapropiado

  Scenario: Eliminar una publicación correctamente
    Given que existe una publicación para eliminar
    When el administrador elimina la publicación
    Then la publicación debe eliminarse correctamente
    And la respuesta de eliminación debe tener código 204

  Scenario: Rechazar eliminación de una publicación inexistente
    Given que no existe la publicación con id 999
    When el administrador intenta eliminar la publicación inexistente
    Then la eliminación debe ser rechazada
    And la respuesta de eliminación debe tener código 404

  Scenario: Rechazar eliminación sin especificar la publicación
    When el administrador intenta eliminar una publicación sin especificar el id
    Then la eliminación debe ser rechazada
    And la respuesta de eliminación debe tener código 400