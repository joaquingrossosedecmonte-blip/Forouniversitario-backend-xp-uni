Feature: Registro de usuarios
  Como estudiante
  Quiero registrarme en el foro
  Para poder participar en las discusiones de la comunidad universitaria

  Scenario: Registrar un usuario correctamente
    Given que no existe un usuario con el correo "juan@universidad.com"
    When el estudiante se registra con nombre "Juan" correo "juan@universidad.com" y contraseña "123456"
    Then el usuario debe registrarse correctamente
    And la respuesta debe tener código 201

  Scenario: Rechazar registro con correo existente
    Given que ya existe un usuario con el correo "juan@universidad.com"
    When el estudiante intenta registrarse con nombre "Juan" correo "juan@universidad.com" y contraseña "123456"
    Then el registro debe ser rechazado
    And la respuesta debe tener código 409

  Scenario: Rechazar registro con datos incompletos
    Given que no existe un usuario con el correo "juan@universidad.com"
    When el estudiante intenta registrarse sin proporcionar una contraseña
    Then el registro debe ser rechazado
    And la respuesta debe tener código 400