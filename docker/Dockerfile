FROM node:12-alpine

# 安装依赖
WORKDIR /app
COPY package.json .
RUN npm install

# 运行
CMD npm start

# 复制文件
COPY . .

# 声明
EXPOSE 3000
VOLUME /app/build