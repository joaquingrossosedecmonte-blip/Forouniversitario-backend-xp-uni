Feature: Reportar una publicación
  Como estudiante
  Quiero reportar una publicación
  Para informar a los administradores sobre contenido inapropiado

  Scenario: Reportar una publicación correctamente
    Given que existe una publicación para reportar
    When el estudiante reporta la publicación con el motivo "Contenido inapropiado"
    Then el reporte debe registrarse correctamente
    And la respuesta del reporte debe tener código 201

  Scenario: Rechazar reporte sobre una publicación inexistente
    Given que no existe la publicación con id 999
    When el estudiante intenta reportar la publicación inexistente con el motivo "Contenido inapropiado"
    Then el reporte debe ser rechazado
    And la respuesta del reporte debe tener código 404

  Scenario: Rechazar reporte sin motivo
    Given que existe una publicación para reportar
    When el estudiante intenta reportar la publicación sin especificar el motivo
    Then el reporte debe ser rechazado
    And la respuesta del reporte debe tener código 400