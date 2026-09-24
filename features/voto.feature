Feature: Votar una publicación
  Como estudiante
  Quiero votar una publicación
  Para expresar mi opinión sobre el contenido del foro

  Scenario: Votar una publicación correctamente
    Given que existe una publicación para votar
    When el estudiante vota la publicación con tipo "positivo"
    Then el voto debe registrarse correctamente
    And la respuesta del voto debe tener código 201

  Scenario: Rechazar voto sobre una publicación inexistente
    Given que no existe la publicación con id 999
    When el estudiante intenta votar la publicación inexistente con tipo "positivo"
    Then el voto debe ser rechazado
    And la respuesta del voto debe tener código 404

  Scenario: Rechazar voto sin especificar el tipo
    Given que existe una publicación para votar
    When el estudiante intenta votar la publicación sin especificar el tipo
    Then el voto debe ser rechazado
    And la respuesta del voto debe tener código 400