import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

export async function enviarTicketPorMail(ticket, emailDestino) {
  const itemsHtml = (ticket.products || [])
    .map(function (item) {
      const subtotal = (item.price || 0) * (item.quantity || 0);
      return `
        <li>
          <b>${item.title || "Producto"}</b>
          — Cantidad: ${item.quantity}
          — $${item.price}
          — Subtotal: $${subtotal}
        </li>
      `;
    })
    .join("");

  const html = `
    <div>
      <h2>Comprobante de compra</h2>
      <p><b>Código:</b> ${ticket.code}</p>
      <p><b>Fecha:</b> ${new Date(ticket.purchase_datetime).toLocaleString()}</p>
      <p><b>Comprador:</b> ${ticket.purchaser}</p>
      <p><b>Total:</b> $${ticket.amount}</p>

      <hr />

      <h3>Detalle</h3>
      <ul>
        ${itemsHtml || "<li>Sin detalle</li>"}
      </ul>

      <p>Gracias por tu compra 💚</p>
    </div>
  `;

  return transporter.sendMail({
    from: `Mi Ecommerce <${process.env.MAIL_USER}>`,
    to: emailDestino,
    subject: `Tu comprobante de compra (${ticket.code})`,
    html: html
  });
}

export function enviarResetPasswordPorMail(emailDestino, link) {
  const html = `
    <div>
      <h2>Restablecer contraseña</h2>
      <p>Hacé click en el botón para restablecer tu contraseña (expira en 1 hora).</p>

      <a href="${link}" style="display:inline-block;padding:10px 14px;background:#222;color:#fff;text-decoration:none;border-radius:6px;">
        Restablecer contraseña
      </a>

      <p>Si no pediste esto, ignorá el correo.</p>
    </div>
  `;

  return transporter.sendMail({
    from: `Mi Ecommerce <${process.env.MAIL_USER}>`,
    to: emailDestino,
    subject: "Restablecer contraseña",
    html: html
  });
}