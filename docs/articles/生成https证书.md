#  1.https证书生成过程

![](.\images\https证书生成过程.png)



* 一些概念
* PKI：Public Key Infrastructure  公钥基础设施，一种遵循既定标准的密钥管理平台,它能够为所有网络应用提供加密和数字签名等密码服务及所必需的密钥和证书管理体系，简单来说，PKI就是利用公钥理论和技术建立的提供安全服务的基础设施。PKI技术是信息安全技术的核心，也是电子商务的关键和基础技术。PKI的基础技术包括加密、数字签名、数据完整性机制、数字信封、双重数字签名等。
* CA：Certificate Authority，签证机构
* RA：Register Authority，注册机构
* CRL：Certificate Revoke Lists，证书吊销列表
* X.509：定义了证书的结构和认证协议的标准。包括版本号、序列号、签名算法、颁发者、有效期限、主体名称、主体公钥、CRL分发点、扩展信息、发行者签名等



* 获取证书的两种方法
  1. 证书授权机构颁发
  2. 自建CA颁发机构->自签名

# 2.自建CA颁发机构

##  2.1 修改配置文件

```shell
vim /etc/pki/tls/openssl.cnf
```

```shell
####################################################################
[ ca ]
default_ca  = CA_default        # The default ca section(默认的CA配置，是CA_default,下面第一个小节就是)
####################################################################
[ CA_default ]
dir     = /etc/pki/CA       # Where everything is kept （dir变量）
certs       = $dir/certs       # Where the issued certs are kept（认证证书目录）
crl_dir     = $dir/crl     # Where the issued crl are kept（注销证书目录）
database    = $dir/index.txt   # database index file.（数据库索引文件）
new_certs_dir   = $dir/newcerts        # default place for new certs.（新证书的默认位置）
certificate = $dir/cacert.pem  # The CA certificate（CA机构证书）
serial      = $dir/serial      # The current serial number（当前序号，默认为空，可以指定从01开始）
crlnumber   = $dir/crlnumber   # the current crl number（下一个吊销证书序号）
                    # must be commented out to leave a V1 CRL
crl     = $dir/crl.pem         # The current CRL（下一个吊销证书）
private_key = $dir/private/cakey.pem# The private key（CA机构的私钥）
RANDFILE    = $dir/private/.rand   # private random number file（随机数文件）
x509_extensions = usr_cert      # The extentions to add to the cert
# Comment out the following two lines for the "traditional"
# (and highly broken) format.
name_opt    = ca_default        # Subject Name options（被颁发者，订阅者选项）
cert_opt    = ca_default        # Certificate field options（认证字段参数）
# Extension copying option: use with caution.
# copy_extensions = copy
# Extensions to add to a CRL. Note: Netscape communicator chokes on V2 CRLs
# so this is commented out by default to leave a V1 CRL.
# crlnumber must also be commented out to leave a V1 CRL.
# crl_extensions    = crl_ext
default_days    = 365           # how long to certify for （默认的有效期天数是365）
default_crl_days= 30            # how long before next CRL
default_md  = sha256        # use SHA-256 by default
preserve    = no            # keep passed DN ordering
# A few difference way of specifying how similar the request should look
# For type CA, the listed attributes must be the same, and the optional
# and supplied fields are just that :-)
policy      = policy_match  # 是否匹配规则
# For the CA policy
[ policy_match ]
countryName     = match   # 国家名是否匹配，match为匹配
stateOrProvinceName = optional  # 州或省名是否需要匹配
organizationName    = optional  # 组织名是否需要匹配
organizationalUnitName  = optional # 组织的部门名字是否需要匹配
commonName      = supplied # 注释
emailAddress        = optional # 邮箱地址
# For the 'anything' policy
# At this point in time, you must list all acceptable 'object'
# types.
[ policy_anything ]
countryName     = optional
stateOrProvinceName = optional
localityName        = optional
organizationName    = optional
organizationalUnitName  = optional
commonName      = supplied
emailAddress        = optional
####################################################################
```

重点关注下面的几个参数：

```shell
dir             = /etc/pki/CA           # Where everything is kept （dir变量）
certs           = $dir/certs            # Where the issued certs are kept（认证证书目录）
database        = $dir/index.txt        # database index file.（数据库索引文件）
new_certs_dir   = $dir/newcerts         # default place for new certs.（新证书的默认位置）
certificate     = $dir/cacert.pem       # The CA certificate（CA机构证书）
serial          = $dir/serial           # The current serial number（当前序号，默认为空，可以指定从01开始）
private_key     = $dir/private/cakey.pem# The private key（CA机构的私钥）
```

## 2.2 创建所需要的文件

```shell
cd /etc/pki/CA/
touch index.txt  #生成证书索引数据库文件
touch serial  # 指定第一个颁发证书的序列号,16进制数，比如可以从1a开始，一般从01开始。
echo 01 > /etc/pki/CA/serial
```

##  2.3 生成CA证书

### 2.3.1 生成私钥

 ```shell
openssl genrsa -out /etc/pki/CA/private/cakey.pem 2048
 ```

### 2.3.2 生成自签名CA证书

```shell
openssl req -new -x509  -key /etc/pki/CA/private/cakey.pem  -days 3650 -out /etc/pki/CA/cacert.pem
```

```shell
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [XX]:CN
State or Province Name (full name) []:BEIJING
Locality Name (eg, city) [Default City]:BEIJING
Organization Name (eg, company) [Default Company Ltd]:CA
Organizational Unit Name (eg, section) []:OPT
Common Name (eg, your name or your server's hostname) []:ca.rancho.com
Email Address []:planet1991@163.com

```

### 2.3.4 将CA证书安装至客户端 用户

#### 2.3.4.1 windows系统

浏览器->设置->管理证书->受信任的根证书颁发机构->导入

![3](.\images\Openssl SAN证书\3.png)

#### 2.3.4.2 linux系统-centos

```shell
cp cacert.pem /etc/pki/ca-trust/source/anchors
update-ca-trust
```

# 3.颁发证书

##  3.1  生成私钥

```shell
cd ~
mkdir https && cd https
openssl genrsa -out server.key 2048
```

## 3.2 生成证书请求

### 3.2.1 普通证书请求

注意go1.5 已废弃，https://go.dev/doc/go1.15#commonname

* The deprecated, legacy behavior of treating the `CommonName` field on X.509 certificates as a host name when no Subject Alternative Names are present is now disabled by default. It can be temporarily re-enabled by adding the value `x509ignoreCN=0` to the `GODEBUG` environment variable.

  Note that if the `CommonName` is an invalid host name, it's always ignored, regardless of `GODEBUG` settings. Invalid names include those with any characters other than letters, digits, hyphens and underscores, and those with empty labels or trailing dots.

```shell
openssl req -new -key server.key -days 3650 -out server.csr
```

  ```shell
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [XX]:CN
State or Province Name (full name) []:BEIJING
Locality Name (eg, city) [Default City]:BEIJING
Organization Name (eg, company) [Default Company Ltd]:CC
Organizational Unit Name (eg, section) []:OPT
Common Name (eg, your name or your server's hostname) []:hub.kuber.com
Email Address []:planet1991@163.com

Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:
An optional company name []:		//回车，不填写

  ```



### 3.2.2 带SAN扩展的证书请求

```shell
cp /etc/pki/tls/openssl.cnf /tmp
vim /tmp/openssl.cnf 
```

此文件的格式是类似 `ini` 的配置文件格式，找到 **[ req ]** 段落，加上下面的配置：

```shell
req_extetions = v3_req
```

这段配置表示在生成 CSR 文件时读取名叫 `v3_req` 的段落的配置信息，因此我们再在此配置文件中加入一段名为 `v3_req` 的配置

```shell
[ v3_req ]
# Extensions to add to a certificate request

basicConstraints = CA:FALSE
keyUsage = nonRepudiation, digitalSignature, keyEncipherment
subjectAltName = @alt_names
```

这段配置中最重要的是在最后导入名为 `alt_names` 的配置段，因此我们还需要添加一个名为 `[ alt_names ]` 的配置段：

```shell
[ alt_names ]
DNS.1 = hub.kuber.com
IP.1 = 192.168.66.200

[ alt_names ]
IP.1 = 172.18.128.36

```

这里填入需要加入到 Subject Alternative Names 段落中的域名名称，可以写入多个。

接着使用这个临时配置生成证书请求：

```shell
openssl req -new -nodes -keyout server.key -out server.csr -config /tmp/openssl.cnf
openssl req -new -nodes -keyout server.key -out server.csr -config openssl.cnf

```

```shell
Generating a 2048 bit RSA private key
....+++
.................................+++
writing new private key to 'server.key'
-----
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [XX]:CN
State or Province Name (full name) []:BEIJING
Locality Name (eg, city) [Default City]:BEIJING
Organization Name (eg, company) [Default Company Ltd]:CC
Organizational Unit Name (eg, section) []:OPT
Common Name (eg, your name or your server's hostname) []:www.rancho.com
Email Address []:planet1991@163.com

Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:
An optional company name []:
```





查看证书请求文件的内容：

```shell
openssl req -text -noout -in server.csr
```

可以看到此证书请求文件中会包含 Subject Alternative Names 字段，并包含之前在配置文件中填写的域名。

##  3.3 使用CA证书签发证书

使用CA机器签发证书

### 3.3.1 普通证书

```shell
openssl ca -in server.csr  -days 365  -out server.crt 
```



### 3.3.2 带SAN扩展的证书

```shell
# 将 /tmp/openssl.cnf  server.csr 复制到CA机器
openssl ca -policy policy_anything -out server.crt -config /tmp/openssl.cnf -extensions v3_req -infiles server.csr

openssl ca -policy policy_anything -out server.crt -config openssl.cnf -extensions v3_req -infiles server.csr
```



#  4. 将私钥和签发的证书配置到服务器



# 附录：OpenSSL SAN证书

##  什么是SAN

* SAN(Subject Alternative Name) 是 [SSL](https://so.csdn.net/so/search?q=SSL&spm=1001.2101.3001.7020) 标准 x509 中定义的一个扩展。使用了 SAN 字段的 SSL 证书，可以扩展此证书支持的域名，使得一个证书可以支持多个不同域名的解析。

* 先来看一看 Google 是怎样使用 SAN 证书的，下面是 Youtube 网站的证书信息：

  ![1](F:\article\images\Openssl SAN证书\1.png)

* 这里可以看到这张证书的 Common Name 字段是 *.google.com，那么为什么这张证书却能够被 www.youtube.com
*  这个域名所使用呢。原因就是这是一张带有 SAN 扩展的证书，下面是这张证书的 SAN 扩展信息：![2](F:\article\images\Openssl SAN证书\2.png)

* 这里可以看到，这张证书的 Subject Alternative Name 段中列了一大串的域名，因此这张证书能够被多个域名所使用。对于 Google 这种域名数量较多的公司来说，使用这种类型的证书能够极大的简化网站证书的管理。

  