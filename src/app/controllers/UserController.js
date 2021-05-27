import User from '../models/User';
import * as Yup from 'yup';

class UserController {
  async store(req, res) {
    const schema = await Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
      password: Yup.string().required().min(8),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        message: 'Falha na validação',
      });
    }

    const userExists = await User.findOne({
      where: { email: req.body.email },
    });
    if (userExists) res.status(400).json({ error: 'Usuário já cadastrado' });

    const { id, name, email, provider } = await User.create(req.body);
    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  async update(req, res) {
    const schema = await Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldpassword: Yup.string().min(8),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldpassword, field) =>
          oldpassword ? field.required() : field,
        ),
      confirmpassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field,
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        message: 'Falha na validação',
      });
    }

    const { email, oldpassword } = req.body;
    const user = await User.findByPk(req.userId);

    if (email && email !== user.email) {
      const userExists = await User.findOne({
        where: { email },
      });
      if (userExists) res.status(400).json({ error: 'Usuário já cadastrado' });
    }

    if (oldpassword && !(await user.checkPassword(oldpassword))) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    const { id, name, provider } = await user.update(req.body);
    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
