/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["undici", "@firebase/auth"],
  webpack: (config, { isServer }) => {
    // undiciモジュールのトランスパイル設定
    config.module.rules.push({
      test: /\.js$/,
      include: /node_modules\/undici/,
      use: {
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"],
          plugins: [
            "@babel/plugin-transform-private-methods",
            "@babel/plugin-transform-class-properties",
          ],
        },
      },
    });

    return config;
  },
};

module.exports = nextConfig;
