module.exports = {
  generarUsuario: function (context, events, done) {
    const numero = Math.floor(Math.random() * 1000000);

    context.vars.nombre = `Fran${numero}`;
    context.vars.email = `fran${numero}@test.com`;
    context.vars.password = '123456';

    return done();
  }
};