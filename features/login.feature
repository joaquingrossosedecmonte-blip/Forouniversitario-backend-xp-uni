Feature: Inicio de sesión
  Como estudiante
  Quiero iniciar sesión en el foro
  Para poder acceder a mi cuenta y participar en las discusiones

  Scenario: Iniciar sesión correctamente
    Given que existe un usuario registrado con el correo "login@universidad.com" y contraseña "123456"
    When el estudiante inicia sesión con correo "login@universidad.com" y contraseña "123456"
    Then el inicio de sesión debe ser exitoso
    And la respuesta del login debe tener código 200
    And la respuesta debe contener un token

  Scenario: Rechazar inicio de sesión con contraseña incorrecta
    Given que existe un usuario registrado con el correo "login@universidad.com" y contraseña "123456"
    When el estudiante inicia sesión con correo "login@universidad.com" y contraseña "654321"
    Then el inicio de sesión debe ser rechazado
    And la respuesta del login debe tener código 401

  Scenario: Rechazar inicio de sesión con usuario inexistente
    Given que no existe un usuario con el correo "inexistente@universidad.com"
    When el estudiante inicia sesión con correo "inexistente@universidad.com" y contraseña "123456"
    Then el inicio de sesión debe ser rechazado
    And la respuesta del login debe tener código 401