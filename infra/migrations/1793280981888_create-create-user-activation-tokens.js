exports.up = (pgm) => {
  pgm.createTable("user_activation_tokens", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },

    used: {
      type: "boolean",
      notNull: true,
      default: false,
    },

    used_at: {
      type: "timestamptz",
      notNull: false,
    },

    user_id: {
      type: "uuid",
      notNull: true,
      unique: false,
    },

    expires_at: {
      type: "timestamptz",
      notNull: true,
    },

    created_at: {
      type: "timestamptz",
      default: pgm.func("timezone('utc', now())"),
      notNull: true,
    },

    updated_at: {
      type: "timestamptz",
      default: pgm.func("timezone('utc', now())"),
      notNull: true,
    },
  });
};

exports.down = false;
