(self["webpackChunkdna_ng"] = self["webpackChunkdna_ng"] || []).push([[179],{
   /***/ 44262:
    /*!********************************************************!*\
      !*** ./node_modules/@aws-amplify/auth/lib-esm/Auth.js ***!
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   Auth: () => (/* binding */ Auth),
    /* harmony export */   AuthClass: () => (/* binding */ AuthClass)
    /* harmony export */ });
    /* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! tslib */ 23906);
    /* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./types/Auth */ 41945);
    /* harmony import */ var _aws_amplify_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @aws-amplify/core */ 94296);
    /* harmony import */ var _aws_amplify_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @aws-amplify/core */ 87401);
    /* harmony import */ var _aws_amplify_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @aws-amplify/core */ 37981);
    /* harmony import */ var _aws_amplify_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @aws-amplify/core */ 68280);
    /* harmony import */ var _aws_amplify_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @aws-amplify/core */ 36578);
    /* harmony import */ var _aws_amplify_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @aws-amplify/core */ 83088);
    /* harmony import */ var _aws_amplify_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @aws-amplify/core */ 56305);
    /* harmony import */ var _aws_amplify_core__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @aws-amplify/core */ 85626);
    /* harmony import */ var _aws_amplify_core__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @aws-amplify/core */ 41522);
    /* harmony import */ var _aws_amplify_core__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @aws-amplify/core */ 19418);
    /* harmony import */ var amazon_cognito_identity_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! amazon-cognito-identity-js */ 48673);
    /* harmony import */ var amazon_cognito_identity_js_internals__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! amazon-cognito-identity-js/internals */ 75000);
    /* harmony import */ var url__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! url */ 52445);
    /* harmony import */ var _OAuth_OAuth__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./OAuth/OAuth */ 19742);
    /* harmony import */ var _urlListener__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./urlListener */ 83820);
    /* harmony import */ var _Errors__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./Errors */ 71397);
    var logger = new _aws_amplify_core__WEBPACK_IMPORTED_MODULE_3__.ConsoleLogger('AuthClass');
    var USER_ADMIN_SCOPE = 'aws.cognito.signin.user.admin';
    var OAUTH_FLOW_MS_TIMEOUT = 10 * 1000;
    var AMPLIFY_SYMBOL = typeof Symbol !== 'undefined' && typeof Symbol.for === 'function' ? Symbol.for('amplify_default') : '@@amplify_default';
    var dispatchAuthEvent = function (event, data, message) {
      _aws_amplify_core__WEBPACK_IMPORTED_MODULE_4__.Hub.dispatch('auth', {
        event: event,
        data: data,
        message: message
      }, 'Auth', AMPLIFY_SYMBOL);
    };
    // Cognito Documentation for max device
    // tslint:disable-next-line:max-line-length
    // https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_ListDevices.html#API_ListDevices_RequestSyntax
    var MAX_DEVICES = 60;
    var MAX_AUTOSIGNIN_POLLING_MS = 3 * 60 * 1000;
    /**
     * Provide authentication steps
     */
    var AuthClass = /** @class */function () {
      /**
       * Initialize Auth with AWS configurations
       * @param {Object} config - Configuration of the Auth
       */
      function AuthClass(config) {
        var _this = this;
        this.userPool = null;
        this.user = null;
        this.oAuthFlowInProgress = false;
        this.autoSignInInitiated = false;
        this.inflightSessionPromise = null;
        this.inflightSessionPromiseCounter = 0;
        this.Credentials = _aws_amplify_core__WEBPACK_IMPORTED_MODULE_5__.Credentials;
        this.wrapRefreshSessionCallback = function (callback) {
          var wrapped = function (error, data) {
            if (data) {
              dispatchAuthEvent('tokenRefresh', undefined, "New token retrieved");
            } else {
              dispatchAuthEvent('tokenRefresh_failure', error, "Failed to retrieve new token");
            }
            return callback(error, data);
          };
          return wrapped;
        }; 
        this.configure(config);
        this.currentCredentials = this.currentCredentials.bind(this);
        this.currentUserCredentials = this.currentUserCredentials.bind(this);
        _aws_amplify_core__WEBPACK_IMPORTED_MODULE_4__.Hub.listen('auth', function (_a) {
          var payload = _a.payload;
          var event = payload.event;
          switch (event) {
            case 'verify':
            case 'signIn':
              _this._storage.setItem('amplify-signin-with-hostedUI', 'false');
              break;
            case 'signOut':
              _this._storage.removeItem('amplify-signin-with-hostedUI');
              break;
            case 'cognitoHostedUI':
              _this._storage.setItem('amplify-signin-with-hostedUI', 'true');
              break;
          }
        });
        (0,amazon_cognito_identity_js_internals__WEBPACK_IMPORTED_MODULE_1__.addAuthCategoryToCognitoUserAgent)();
        (0,amazon_cognito_identity_js_internals__WEBPACK_IMPORTED_MODULE_1__.addFrameworkToCognitoUserAgent)(_aws_amplify_core__WEBPACK_IMPORTED_MODULE_6__.Platform.framework);
        _aws_amplify_core__WEBPACK_IMPORTED_MODULE_6__.Platform.observeFrameworkChanges(function () {
          (0,amazon_cognito_identity_js_internals__WEBPACK_IMPORTED_MODULE_1__.addFrameworkToCognitoUserAgent)(_aws_amplify_core__WEBPACK_IMPORTED_MODULE_6__.Platform.framework);
        });
      }
      AuthClass.prototype.getModuleName = function () {
        return 'Auth';
      };
      AuthClass.prototype.configure = function (config) {
        var _this = this;
        if (!config) return this._config || {};
        logger.debug('configure Auth');
        var conf = Object.assign({}, this._config, (0,_aws_amplify_core__WEBPACK_IMPORTED_MODULE_7__.parseAWSExports)(config).Auth, config);
        this._config = conf;
        var _a = this._config,
          userPoolId = _a.userPoolId,
          userPoolWebClientId = _a.userPoolWebClientId,
          cookieStorage = _a.cookieStorage,
          oauth = _a.oauth,
          region = _a.region,
          identityPoolId = _a.identityPoolId,
          mandatorySignIn = _a.mandatorySignIn,
          refreshHandlers = _a.refreshHandlers,
          identityPoolRegion = _a.identityPoolRegion,
          clientMetadata = _a.clientMetadata,
          endpoint = _a.endpoint,
          storage = _a.storage;
        if (!storage) {
          // backward compatability
          if (cookieStorage) this._storage = new amazon_cognito_identity_js__WEBPACK_IMPORTED_MODULE_0__.CookieStorage(cookieStorage);else {
            this._storage = config.ssr ? new _aws_amplify_core__WEBPACK_IMPORTED_MODULE_8__.UniversalStorage() : new _aws_amplify_core__WEBPACK_IMPORTED_MODULE_9__.StorageHelper().getStorage();
          }
        } else {
          if (!this._isValidAuthStorage(storage)) {
            logger.error('The storage in the Auth config is not valid!');
            throw new Error('Empty storage object');
          }
          this._storage = storage;
        }
        this._storageSync = Promise.resolve();
        if (typeof this._storage['sync'] === 'function') {
          this._storageSync = this._storage['sync']();
        }
        if (userPoolId) {
          var userPoolData = {
            UserPoolId: userPoolId,
            ClientId: userPoolWebClientId,
            endpoint: endpoint
          };
          userPoolData.Storage = this._storage;
          this.userPool = new amazon_cognito_identity_js__WEBPACK_IMPORTED_MODULE_0__.CognitoUserPool(userPoolData, this.wrapRefreshSessionCallback);
        }
        this.Credentials.configure({
          mandatorySignIn: mandatorySignIn,
          region: region,
          userPoolId: userPoolId,
          identityPoolId: identityPoolId,
          refreshHandlers: refreshHandlers,
          storage: this._storage,
          identityPoolRegion: identityPoolRegion
        });
        // initialize cognitoauth client if hosted ui options provided
        // to keep backward compatibility:
        var cognitoHostedUIConfig = oauth ? (0,_types__WEBPACK_IMPORTED_MODULE_10__.isCognitoHostedOpts)(this._config.oauth) ? oauth : oauth.awsCognito : undefined;
        if (cognitoHostedUIConfig) {
          var cognitoAuthParams = Object.assign({
            cognitoClientId: userPoolWebClientId,
            UserPoolId: userPoolId,
            domain: cognitoHostedUIConfig['domain'],
            scopes: cognitoHostedUIConfig['scope'],
            redirectSignIn: cognitoHostedUIConfig['redirectSignIn'],
            redirectSignOut: cognitoHostedUIConfig['redirectSignOut'],
            responseType: cognitoHostedUIConfig['responseType'],
            Storage: this._storage,
            urlOpener: cognitoHostedUIConfig['urlOpener'],
            clientMetadata: clientMetadata
          }, cognitoHostedUIConfig['options']);
          this._oAuthHandler = new _OAuth_OAuth__WEBPACK_IMPORTED_MODULE_11__["default"]({
            scopes: cognitoAuthParams.scopes,
            config: cognitoAuthParams,
            cognitoClientId: cognitoAuthParams.cognitoClientId
          });
          // **NOTE** - Remove this in a future major release as it is a breaking change
          // Prevents _handleAuthResponse from being called multiple times in Expo
          // See https://github.com/aws-amplify/amplify-js/issues/4388
          var usedResponseUrls_1 = {};
          (0,_urlListener__WEBPACK_IMPORTED_MODULE_12__["default"])(function (_a) {
            var url = _a.url;
            if (usedResponseUrls_1[url]) {
              return;
            }
            usedResponseUrls_1[url] = true;
            _this._handleAuthResponse(url);
          });
        }
        dispatchAuthEvent('configured', null, "The Auth category has been configured successfully");
        if (!this.autoSignInInitiated && typeof this._storage['getItem'] === 'function') {
          var pollingInitiated = this.isTrueStorageValue('amplify-polling-started');
          if (pollingInitiated) {
            dispatchAuthEvent('autoSignIn_failure', null, _types__WEBPACK_IMPORTED_MODULE_10__.AuthErrorTypes.AutoSignInError);
            this._storage.removeItem('amplify-auto-sign-in');
          }
          this._storage.removeItem('amplify-polling-started');
        }
        return this._config;
      };
      /**
       * Sign up with username, password and other attributes like phone, email
       * @param {String | object} params - The user attributes used for signin
       * @param {String[]} restOfAttrs - for the backward compatability
       * @return - A promise resolves callback data if success
       */
      AuthClass.prototype.signUp = function (params) {
        var _this = this;
        var restOfAttrs = [];
        for (var _i = 1; _i < arguments.length; _i++) {
          restOfAttrs[_i - 1] = arguments[_i];
        }
        var _a, _b, _c;
        if (!this.userPool) {
          return this.rejectNoUserPool();
        }
        var username = null;
        var password = null;
        var attributes = [];
        var validationData = null;
        var clientMetadata;
        var autoSignIn = {
          enabled: false
        };
        var autoSignInValidationData = {};
        var autoSignInClientMetaData = {};
        if (params && typeof params === 'string') {
          username = params;
          password = restOfAttrs ? restOfAttrs[0] : null;
          var email = restOfAttrs ? restOfAttrs[1] : null;
          var phone_number = restOfAttrs ? restOfAttrs[2] : null;
          if (email) attributes.push(new amazon_cognito_identity_js__WEBPACK_IMPORTED_MODULE_0__.CognitoUserAttribute({
            Name: 'email',
            Value: email
          }));
          if (phone_number) attributes.push(new amazon_cognito_identity_js__WEBPACK_IMPORTED_MODULE_0__.CognitoUserAttribute({
            Name: 'phone_number',
            Value: phone_number
          }));
        } else if (params && typeof params === 'object') {
          username = params['username'];
          password = params['password'];
          if (params && params.clientMetadata) {
            clientMetadata = params.clientMetadata;
          } else if (this._config.clientMetadata) {
            clientMetadata = this._config.clientMetadata;
          }
          var attrs_1 = params['attributes'];
          if (attrs_1) {
            Object.keys(attrs_1).map(function (key) {
              attributes.push(new amazon_cognito_identity_js__WEBPACK_IMPORTED_MODULE_0__.CognitoUserAttribute({
                Name: key,
                Value: attrs_1[key]
              }));
            });
          }
          var validationDataObject_1 = params['validationData'];
          if (validationDataObject_1) {
            validationData = [];
            Object.keys(validationDataObject_1).map(function (key) {
              validationData.push(new amazon_cognito_identity_js__WEBPACK_IMPORTED_MODULE_0__.CognitoUserAttribute({
                Name: key,
                Value: validationDataObject_1[key]
              }));
            });
          }
          autoSignIn = (_a = params.autoSignIn) !== null && _a !== void 0 ? _a : {
            enabled: false
          };
          if (autoSignIn.enabled) {
            this._storage.setItem('amplify-auto-sign-in', 'true');
            autoSignInValidationData = (_b = autoSignIn.validationData) !== null && _b !== void 0 ? _b : {};
            autoSignInClientMetaData = (_c = autoSignIn.clientMetaData) !== null && _c !== void 0 ? _c : {};
          }
        } else {
          return this.rejectAuthError(_types__WEBPACK_IMPORTED_MODULE_10__.AuthErrorTypes.SignUpError);
        }
        if (!username) {
          return this.rejectAuthError(_types__WEBPACK_IMPORTED_MODULE_10__.AuthErrorTypes.EmptyUsername);
        }
        if (!password) {
          return this.rejectAuthError(_types__WEBPACK_IMPORTED_MODULE_10__.AuthErrorTypes.EmptyPassword);
        }
        logger.debug('signUp attrs:', attributes);
        logger.debug('signUp validation data:', validationData);
        return new Promise(function (resolve, reject) {
          _this.userPool.signUp(username, password, attributes, validationData, function (err, data) {
            if (err) {
              dispatchAuthEvent('signUp_failure', err, username + " failed to signup");
              reject(err);
            } else {
              dispatchAuthEvent('signUp', data, username + " has signed up successfully");
              if (autoSignIn.enabled) {
                _this.handleAutoSignIn(username, password, autoSignInValidationData, autoSignInClientMetaData, data);
              }
              resolve(data);
            }
          }, clientMetadata);
        });
      };
      AuthClass.prototype.handleAutoSignIn = function (username, password, validationData, clientMetadata, data) {
        this.autoSignInInitiated = true;
        var authDetails = new amazon_cognito_identity_js__WEBPACK_IMPORTED_MODULE_0__.AuthenticationDetails({
          Username: username,
          Password: password,
          ValidationData: validationData,
          ClientMetadata: clientMetadata
        });
        if (data.userConfirmed) {
          this.signInAfterUserConfirmed(authDetails);
        } else if (this._config.signUpVerificationMethod === 'link') {
          this.handleLinkAutoSignIn(authDetails);
        } else {
          this.handleCodeAutoSignIn(authDetails);
        }
      };
      AuthClass.prototype.handleCodeAutoSignIn = function (authDetails) {
        var _this = this;
        var listenEvent = function (_a) {
          var payload = _a.payload;
          if (payload.event === 'confirmSignUp') {
            _this.signInAfterUserConfirmed(authDetails, listenEvent);
          }
        };
        _aws_amplify_core__WEBPACK_IMPORTED_MODULE_4__.Hub.listen('auth', listenEvent);
      };
      AuthClass.prototype.handleLinkAutoSignIn = function (authDetails) {
        var _this = this;
        this._storage.setItem('amplify-polling-started', 'true');
        var start = Date.now();
        var autoSignInPollingIntervalId = setInterval(function () {
          if (Date.now() - start > MAX_AUTOSIGNIN_POLLING_MS) {
            clearInterval(autoSignInPollingIntervalId);
            dispatchAuthEvent('autoSignIn_failure', null, 'Please confirm your account and use your credentials to sign in.');
            _this._storage.removeItem('amplify-auto-sign-in');
          } else {
            _this.signInAfterUserConfirmed(authDetails, null, autoSignInPollingIntervalId);
          }
        }, 5000);
      };
      AuthClass.prototype.signInAfterUserConfirmed = function (authDetails, listenEvent, autoSignInPollingIntervalId) {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__awaiter)(this, void 0, void 0, function () {
          var user, error_1;
          var _this = this;
          return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__generator)(this, function (_a) {
            switch (_a.label) {
              case 0:
                user = this.createCognitoUser(authDetails.getUsername());
                _a.label = 1;
              case 1:
                _a.trys.push([1, 3,, 4]);
                return [4 /*yield*/, user.authenticateUser(authDetails, this.authCallbacks(user, function (value) {
                  dispatchAuthEvent('autoSignIn', value, authDetails.getUsername() + " has signed in successfully");
                  if (listenEvent) {
                    _aws_amplify_core__WEBPACK_IMPORTED_MODULE_4__.Hub.remove('auth', listenEvent);
                  }
                  if (autoSignInPollingIntervalId) {
                    clearInterval(autoSignInPollingIntervalId);
                    _this._storage.removeItem('amplify-polling-started');
                  }
                  _this._storage.removeItem('amplify-auto-sign-in');
                }, function (error) {
                  logger.error(error);
                  _this._storage.removeItem('amplify-auto-sign-in');
                }))];
              case 2:
                _a.sent();
                return [3 /*break*/, 4];
              case 3:
                error_1 = _a.sent();
                logger.error(error_1);
                return [3 /*break*/, 4];
              case 4:
                return [2 /*return*/];
            }
          });
        });
      };
      /**
       * Send the verification code to confirm sign up
       * @param {String} username - The username to be confirmed
       * @param {String} code - The verification code
       * @param {ConfirmSignUpOptions} options - other options for confirm signup
       * @return - A promise resolves callback data if success
       */
      AuthClass.prototype.confirmSignUp = function (username, code, options) {
        var _this = this;
        if (!this.userPool) {
          return this.rejectNoUserPool();
        }
        if (!username) {
          return this.rejectAuthError(_types__WEBPACK_IMPORTED_MODULE_10__.AuthErrorTypes.EmptyUsername);
        }
        if (!code) {
          return this.rejectAuthError(_types__WEBPACK_IMPORTED_MODULE_10__.AuthErrorTypes.EmptyCode);
        }
        var user = this.createCognitoUser(username);
        var forceAliasCreation = options && typeof options.forceAliasCreation === 'boolean' ? options.forceAliasCreation : true;
        var clientMetadata;
        if (options && options.clientMetadata) {
          clientMetadata = options.clientMetadata;
        } else if (this._config.clientMetadata) {
          clientMetadata = this._config.clientMetadata;
        }
        return new Promise(function (resolve, reject) {
          user.confirmRegistration(code, forceAliasCreation, function (err, data) {
            if (err) {
              reject(err);
            } else {
              dispatchAuthEvent('confirmSignUp', data, username + " has been confirmed successfully");
              var autoSignIn = _this.isTrueStorageValue('amplify-auto-sign-in');
              if (autoSignIn && !_this.autoSignInInitiated) {
                dispatchAuthEvent('autoSignIn_failure', null, _types__WEBPACK_IMPORTED_MODULE_10__.AuthErrorTypes.AutoSignInError);
                _this._storage.removeItem('amplify-auto-sign-in');
              }
              resolve(data);
            }
          }, clientMetadata);
        });
      };
      AuthClass.prototype.isTrueStorageValue = function (value) {
        var item = this._storage.getItem(value);
        return item ? item === 'true' : false;
      };
      /**
       * Resend the verification code
       * @param {String} username - The username to be confirmed
       * @param {ClientMetadata} clientMetadata - Metadata to be passed to Cognito Lambda triggers
       * @return - A promise resolves code delivery details if successful
       */
      AuthClass.prototype.resendSignUp = function (username, clientMetadata) {
        if (clientMetadata === void 0) {
          clientMetadata = this._config.clientMetadata;
        }
        if (!this.userPool) {
          return this.rejectNoUserPool();
        }
        if (!username) {
          return this.rejectAuthError(_types__WEBPACK_IMPORTED_MODULE_10__.AuthErrorTypes.EmptyUsername);
        }
        var user = this.createCognitoUser(username);
        return new Promise(function (resolve, reject) {
          user.resendConfirmationCode(function (err, data) {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          }, clientMetadata);
        });
      };
      /**
       * Sign in
       * @param {String | SignInOpts} usernameOrSignInOpts - The username to be signed in or the sign in options
       * @param {String} pw - The password of the username
       * @param {ClientMetaData} clientMetadata - Client metadata for custom workflows
       * @return - A promise resolves the CognitoUser
       */
      AuthClass.prototype.signIn = function (usernameOrSignInOpts, pw, clientMetadata) {
        if (clientMetadata === void 0) {
          clientMetadata = this._config.clientMetadata;
        }
        if (!this.userPool) {
          return this.rejectNoUserPool();
        }
        var username = null;
        var password = null;
        var validationData = {};
        // for backward compatibility
        if (typeof usernameOrSignInOpts === 'string') {
          username = usernameOrSignInOpts;
          password = pw;
        } else if ((0,_types__WEBPACK_IMPORTED_MODULE_10__.isUsernamePasswordOpts)(usernameOrSignInOpts)) {
          if (typeof pw !== 'undefined') {
            logger.warn('The password should be defined under the first parameter object!');
          }
          username = usernameOrSignInOpts.username;
          password = usernameOrSignInOpts.password;
          validationData = usernameOrSignInOpts.validationData;
        } else {
          return this.rejectAuthError(_types__WEBPACK_IMPORTED_MODULE_10__.AuthErrorTypes.InvalidUsername);
        }
        if (!username) {
          return this.rejectAuthError(_types__WEBPACK_IMPORTED_MODULE_10__.AuthErrorTypes.EmptyUsername);
        }
        var authDetails = new amazon_cognito_identity_js__WEBPACK_IMPORTED_MODULE_0__.AuthenticationDetails({
          Username: username,
          Password: password,
          ValidationData: validationData,
          ClientMetadata: clientMetadata
        });
        if (password) {
          return this.signInWithPassword(authDetails);
        } else {
          return this.signInWithoutPassword(authDetails);
        }
      };
      /**
       * Return an object with the authentication callbacks
       * @param {CognitoUser} user - the cognito user object
       * @param {} resolve - function called when resolving the current step
       * @param {} reject - function called when rejecting the current step
       * @return - an object with the callback methods for user authentication
       */
      AuthClass.prototype.authCallbacks = function (user, resolve, reject) {
        var _this = this;
        var that = this;
        return {
          onSuccess: function (session) {
            return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__awaiter)(_this, void 0, void 0, function () {
              var cred, e_1, currentUser, e_2;
              return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__generator)(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    logger.debug(session);
                    delete user['challengeName'];
                    delete user['challengeParam'];
                    _a.label = 1;
                  case 1:
                    _a.trys.push([1, 4, 5, 9]);
                    return [4 /*yield*/, this.Credentials.clear()];
                  case 2:
                    _a.sent();
                    return [4 /*yield*/, this.Credentials.set(session, 'session')];
                  case 3:
                    cred = _a.sent();
                    logger.debug('succeed to get cognito credentials', cred);
                    return [3 /*break*/, 9];
                  case 4:
                    e_1 = _a.sent();
                    logger.debug('cannot get cognito credentials', e_1);
                    return [3 /*break*/, 9];
                  case 5:
                    _a.trys.push([5, 7,, 8]);
                    return [4 /*yield*/, this.currentUserPoolUser()];
                  case 6:
                    currentUser = _a.sent();
                    that.user = currentUser;
                    dispatchAuthEvent('signIn', currentUser, "A user " + user.getUsername() + " has been signed in");
                    resolve(currentUser);
                    return [3 /*break*/, 8];
                  case 7:
                    e_2 = _a.sent();
                    logger.error('Failed to get the signed in user', e_2);
                    reject(e_2);
                    return [3 /*break*/, 8];
                  case 8:
                    return [7 /*endfinally*/];
                  case 9:
                    return [2 /*return*/];
                }
              });
            });
          },
          onFailure: function (err) {
            logger.debug('signIn failure', err);
            dispatchAuthEvent('signIn_failure', err, user.getUsername() + " failed to signin");
            reject(err);
          },
          customChallenge: function (challengeParam) {
            logger.debug('signIn custom challenge answer required');
            user['challengeName'] = 'CUSTOM_CHALLENGE';
            user['challengeParam'] = challengeParam;
            resolve(user);
          },
          mfaRequired: function (challengeName, challengeParam) {
            logger.debug('signIn MFA required');
            user['challengeName'] = challengeName;
            user['challengeParam'] = challengeParam;
            resolve(user);
          },
          mfaSetup: function (challengeName, challengeParam) {
            logger.debug('signIn mfa setup', challengeName);
            user['challengeName'] = challengeName;
            user['challengeParam'] = challengeParam;
            resolve(user);
          },
          newPasswordRequired: function (userAttributes, requiredAttributes) {
            logger.debug('signIn new password');
            user['challengeName'] = 'NEW_PASSWORD_REQUIRED';
            user['challengeParam'] = {
              userAttributes: userAttributes,
              requiredAttributes: requiredAttributes
            };
            resolve(user);
          },
          totpRequired: function (challengeName, challengeParam) {
            logger.debug('signIn totpRequired');
            user['challengeName'] = challengeName;
            user['challengeParam'] = challengeParam;
            resolve(user);
          },
          selectMFAType: function (challengeName, challengeParam) {
            logger.debug('signIn selectMFAType', challengeName);
            user['challengeName'] = challengeName;
            user['challengeParam'] = challengeParam;
            resolve(user);
          }
        };
      };
      /**
       * Sign in with a password
       * @private
       * @param {AuthenticationDetails} authDetails - the user sign in data
       * @return - A promise resolves the CognitoUser object if success or mfa required
       */
      AuthClass.prototype.signInWithPassword = function (authDetails) {
        var _this = this;
        if (this.pendingSignIn) {
          throw new Error('Pending sign-in attempt already in progress');
        }
        var user = this.createCognitoUser(authDetails.getUsername());
        this.pendingSignIn = new Promise(function (resolve, reject) {
          user.authenticateUser(authDetails, _this.authCallbacks(user, function (value) {
            _this.pendingSignIn = null;
            resolve(value);
          }, function (error) {
            _this.pendingSignIn = null;
            reject(error);
          }));
        });
        return this.pendingSignIn;
      };
      /**
       * Sign in without a password
       * @private
       * @param {AuthenticationDetails} authDetails - the user sign in data
       * @return - A promise resolves the CognitoUser object if success or mfa required
       */
      AuthClass.prototype.signInWithoutPassword = function (authDetails) {
        var _this = this;
        var user = this.createCognitoUser(authDetails.getUsername());
        user.setAuthenticationFlowType('CUSTOM_AUTH');
        return new Promise(function (resolve, reject) {
          user.initiateAuth(authDetails, _this.authCallbacks(user, resolve, reject));
        });
      };
      /**
       * This was previously used by an authenticated user to get MFAOptions,
       * but no longer returns a meaningful response. Refer to the documentation for
       * how to setup and use MFA: https://docs.amplify.aws/lib/auth/mfa/q/platform/js
       * @deprecated
       * @param {CognitoUser} user - the current user
       * @return - A promise resolves the current preferred mfa option if success
       */
      AuthClass.prototype.getMFAOptions = function (user) {
        return new Promise(function (res, rej) {
          user.getMFAOptions(function (err, mfaOptions) {
            if (err) {
              logger.debug('get MFA Options failed', err);
              rej(err);
              return;
            }
            logger.debug('get MFA options success', mfaOptions);
            res(mfaOptions);
            return;
          });
        });
      };
      /**
       * get preferred mfa method
       * @param {CognitoUser} user - the current cognito user
       * @param {GetPreferredMFAOpts} params - options for getting the current user preferred MFA
       */
      AuthClass.prototype.getPreferredMFA = function (user, params) {
        var _this = this;
        var that = this;
        return new Promise(function (res, rej) {
          var clientMetadata = _this._config.clientMetadata; // TODO: verify behavior if this is override during signIn
          var bypassCache = params ? params.bypassCache : false;
          user.getUserData(function (err, data) {
            return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__awaiter)(_this, void 0, void 0, function () {
              var cleanUpError_1, mfaType;
              return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__generator)(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    if (!err) return [3 /*break*/, 5];
                    logger.debug('getting preferred mfa failed', err);
                    if (!this.isSessionInvalid(err)) return [3 /*break*/, 4];
                    _a.label = 1;
                  case 1:
                    _a.trys.push([1, 3,, 4]);
                    return [4 /*yield*/, this.cleanUpInvalidSession(user)];
                  case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                  case 3:
                    cleanUpError_1 = _a.sent();
                    rej(new Error("Session is invalid due to: " + err.message + " and failed to clean up invalid session: " + cleanUpError_1.message));
                    return [2 /*return*/];
                  case 4:
                    rej(err);
                    return [2 /*return*/];
                  case 5:
                    mfaType = that._getMfaTypeFromUserData(data);
                    if (!mfaType) {
                      rej('invalid MFA Type');
                      return [2 /*return*/];
                    } else {
                      res(mfaType);
                      return [2 /*return*/];
                    }
                    return [2 /*return*/];
                }
              });
            });
          }, {
            bypassCache: bypassCache,
            clientMetadata: clientMetadata
          });
        });
      };
      AuthClass.prototype._getMfaTypeFromUserData = function (data) {
        var ret = null;
        var preferredMFA = data.PreferredMfaSetting;
        // if the user has used Auth.setPreferredMFA() to setup the mfa type
        // then the "PreferredMfaSetting" would exist in the response
        if (preferredMFA) {
          ret = preferredMFA;
        } else {
          // if mfaList exists but empty, then its noMFA
          var mfaList = data.UserMFASettingList;
          if (!mfaList) {
            // if SMS was enabled by using Auth.enableSMS(),
            // the response would contain MFAOptions
            // as for now Cognito only supports for SMS, so we will say it is 'SMS_MFA'
            // if it does not exist, then it should be NOMFA
            var MFAOptions = data.MFAOptions;
            if (MFAOptions) {
              ret = 'SMS_MFA';
            } else {
              ret = 'NOMFA';
            }
          } else if (mfaList.length === 0) {
            ret = 'NOMFA';
          } else {
            logger.debug('invalid case for getPreferredMFA', data);
          }
        }
        return ret;
      };
      AuthClass.prototype._getUserData = function (user, params) {
        var _this = this;
        return new Promise(function (res, rej) {
          user.getUserData(function (err, data) {
            return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__awaiter)(_this, void 0, void 0, function () {
              var cleanUpError_2;
              return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__generator)(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    if (!err) return [3 /*break*/, 5];
                    logger.debug('getting user data failed', err);
                    if (!this.isSessionInvalid(err)) return [3 /*break*/, 4];
                    _a.label = 1;
                  case 1:
                    _a.trys.push([1, 3,, 4]);
                    return [4 /*yield*/, this.cleanUpInvalidSession(user)];
                  case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                  case 3:
                    cleanUpError_2 = _a.sent();
                    rej(new Error("Session is invalid due to: " + err.message + " and failed to clean up invalid session: " + cleanUpError_2.message));
                    return [2 /*return*/];
                  case 4:
                    rej(err);
                    return [2 /*return*/];
                  case 5:
                    res(data);
                    _a.label = 6;
                  case 6:
                    return [2 /*return*/];
                }
              });
            });
          }, params);
        });
      };
      /**
       * set preferred MFA method
       * @param {CognitoUser} user - the current Cognito user
       * @param {string} mfaMethod - preferred mfa method
       * @return - A promise resolve if success
       */
      AuthClass.prototype.setPreferredMFA = function (user, mfaMethod) {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__awaiter)(this, void 0, void 0, function () {
          var clientMetadata, userData, smsMfaSettings, totpMfaSettings, _a, mfaList, currentMFAType, that;
          var _this = this;
          return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__generator)(this, function (_b) {
            switch (_b.label) {
              case 0:
                clientMetadata = this._config.clientMetadata;
                return [4 /*yield*/, this._getUserData(user, {
                  bypassCache: true,
                  clientMetadata: clientMetadata
                })];
              case 1:
                userData = _b.sent();
                smsMfaSettings = null;
                totpMfaSettings = null;
                _a = mfaMethod;
                switch (_a) {
                  case 'TOTP':
                    return [3 /*break*/, 2];
                  case 'SOFTWARE_TOKEN_MFA':
                    return [3 /*break*/, 2];
                  case 'SMS':
                    return [3 /*break*/, 3];
                  case 'SMS_MFA':
                    return [3 /*break*/, 3];
                  case 'NOMFA':
                    return [3 /*break*/, 4];
                }
                return [3 /*break*/, 6];
              case 2:
                totpMfaSettings = {
                  PreferredMfa: true,
                  Enabled: true
                };
                return [3 /*break*/, 7];
              case 3:
                smsMfaSettings = {
                  PreferredMfa: true,
                  Enabled: true
                };
                return [3 /*break*/, 7];
              case 4:
                mfaList = userData['UserMFASettingList'];
                return [4 /*yield*/, this._getMfaTypeFromUserData(userData)];
              case 5:
                currentMFAType = _b.sent();
                if (currentMFAType === 'NOMFA') {
                  return [2 /*return*/, Promise.resolve('No change for mfa type')];
                } else if (currentMFAType === 'SMS_MFA') {
                  smsMfaSettings = {
                    PreferredMfa: false,
                    Enabled: false
                  };
                } else if (currentMFAType === 'SOFTWARE_TOKEN_MFA') {
                  totpMfaSettings = {
                    PreferredMfa: false,
                    Enabled: false
                  };
                } else {
                  return [2 /*return*/, this.rejectAuthError(_types__WEBPACK_IMPORTED_MODULE_10__.AuthErrorTypes.InvalidMFA)];
                }
                // if there is a UserMFASettingList in the response
                // we need to disable every mfa type in that list
                if (mfaList && mfaList.length !== 0) {
                  // to disable SMS or TOTP if exists in that list
                  mfaList.forEach(function (mfaType) {
                    if (mfaType === 'SMS_MFA') {
                      smsMfaSettings = {
                        PreferredMfa: false,
                        Enabled: false
                      };
                    } else if (mfaType === 'SOFTWARE_TOKEN_MFA') {
                      totpMfaSettings = {
                        PreferredMfa: false,
                        Enabled: false
                      };
                    }
                  });
                }
                return [3 /*break*/, 7];
              case 6:
                logger.debug('no validmfa method provided');
                return [2 /*return*/, this.rejectAuthError(_types__WEBPACK_IMPORTED_MODULE_10__.AuthErrorTypes.NoMFA)];
              case 7:
                that = this;
                return [2 /*return*/, new Promise(function (res, rej) {
                  user.setUserMfaPreference(smsMfaSettings, totpMfaSettings, function (err, result) {
                    if (err) {
                      logger.debug('Set user mfa preference error', err);
                      return rej(err);
                    }
                    logger.debug('Set user mfa success', result);
                    logger.debug('Caching the latest user data into local');
                    // cache the latest result into user data
                    user.getUserData(function (err, data) {
                      return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__awaiter)(_this, void 0, void 0, function () {
                        var cleanUpError_3;
                        return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__generator)(this, function (_a) {
                          switch (_a.label) {
                            case 0:
                              if (!err) return [3 /*break*/, 5];
                              logger.debug('getting user data failed', err);
                              if (!this.isSessionInvalid(err)) return [3 /*break*/, 4];
                              _a.label = 1;
                            case 1:
                              _a.trys.push([1, 3,, 4]);
                              return [4 /*yield*/, this.cleanUpInvalidSession(user)];
                            case 2:
                              _a.sent();
                              return [3 /*break*/, 4];
                            case 3:
                              cleanUpError_3 = _a.sent();
                              rej(new Error("Session is invalid due to: " + err.message + " and failed to clean up invalid session: " + cleanUpError_3.message));
                              return [2 /*return*/];
                            case 4:
                              return [2 /*return*/, rej(err)];
                            case 5:
                              return [2 /*return*/, res(result)];
                          }
                        });
                      });
                    }, {
                      bypassCache: true,
                      clientMetadata: clientMetadata
                    });
                  });
                })];
            }
          });
        });
      };
      /**
       * disable SMS
       * @deprecated
       * @param {CognitoUser} user - the current user
       * @return - A promise resolves is success
       */
      AuthClass.prototype.disableSMS = function (user) {
        return new Promise(function (res, rej) {
          user.disableMFA(function (err, data) {
            if (err) {
              logger.debug('disable mfa failed', err);
              rej(err);
              return;
            }
            logger.debug('disable mfa succeed', data);
            res(data);
            return;
          });
        });
      };
      /**
       * enable SMS
       * @deprecated
       * @param {CognitoUser} user - the current user
       * @return - A promise resolves is success
       */
      AuthClass.prototype.enableSMS = function (user) {
        return new Promise(function (res, rej) {
          user.enableMFA(function (err, data) {
            if (err) {
              logger.debug('enable mfa failed', err);
              rej(err);
              return;
            }
            logger.debug('enable mfa succeed', data);
            res(data);
            return;
          });
        });
      };
      /**
       * Setup TOTP
       * @param {CognitoUser} user - the current user
       * @return - A promise resolves with the secret code if success
       */
      AuthClass.prototype.setupTOTP = function (user) {
        return new Promise(function (res, rej) {
          user.associateSoftwareToken({
            onFailure: function (err) {
              logger.debug('associateSoftwareToken failed', err);
              rej(err);
              return;
            },
            associateSecretCode: function (secretCode) {
              logger.debug('associateSoftwareToken success', secretCode);
              res(secretCode);
              return;
            }
          });
        });
      };
      /**
       * verify TOTP setup
       * @param {CognitoUser} user - the current user
       * @param {string} challengeAnswer - challenge answer
       * @return - A promise resolves is success
       */
      AuthClass.prototype.verifyTotpToken = function (user, challengeAnswer) {
        logger.debug('verification totp token', user, challengeAnswer);
        var signInUserSession;
        if (user && typeof user.getSignInUserSession === 'function') {
          signInUserSession = user.getSignInUserSession();
        }
        var isLoggedIn = signInUserSession === null || signInUserSession === void 0 ? void 0 : signInUserSession.isValid();
        return new Promise(function (res, rej) {
          user.verifySoftwareToken(challengeAnswer, 'My TOTP device', {
            onFailure: function (err) {
              logger.debug('verifyTotpToken failed', err);
              rej(err);
              return;
            },
            onSuccess: function (data) {
              if (!isLoggedIn) {
                dispatchAuthEvent('signIn', user, "A user " + user.getUsername() + " has been signed in");
              }
              dispatchAuthEvent('verify', user, "A user " + user.getUsername() + " has been verified");
              logger.debug('verifyTotpToken success', data);
              res(data);
              return;
            }
          });
        });
      };
      /**
       * Send MFA code to confirm sign in
       * @param {Object} user - The CognitoUser object
       * @param {String} code - The confirmation code
       */
      AuthClass.prototype.confirmSignIn = function (user, code, mfaType, clientMetadata) {
        var _this = this;
        if (clientMetadata === void 0) {
          clientMetadata = this._config.clientMetadata;
        }
        if (!code) {
          return this.rejectAuthError(_types__WEBPACK_IMPORTED_MODULE_10__.AuthErrorTypes.EmptyCode);
        }
        var that = this;
        return new Promise(function (resolve, reject) {
          user.sendMFACode(code, {
            onSuccess: function (session) {
              return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__awaiter)(_this, void 0, void 0, function () {
                var cred, e_3, currentUser, e_4;
                return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__generator)(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      logger.debug(session);
                      _a.label = 1;
                    case 1:
                      _a.trys.push([1, 4, 5, 10]);
                      return [4 /*yield*/, this.Credentials.clear()];
                    case 2:
                      _a.sent();
                      return [4 /*yield*/, this.Credentials.set(session, 'session')];
                    case 3:
                      cred = _a.sent();
                      logger.debug('succeed to get cognito credentials', cred);
                      return [3 /*break*/, 10];
                    case 4:
                      e_3 = _a.sent();
                      logger.debug('cannot get cognito credentials', e_3);
                      return [3 /*break*/, 10];
                    case 5:
                      that.user = user;
                      _a.label = 6;
                    case 6:
                      _a.trys.push([6, 8,, 9]);
                      return [4 /*yield*/, this.currentUserPoolUser()];
                    case 7:
                      currentUser = _a.sent();
                      user.attributes = currentUser.attributes;
                      return [3 /*break*/, 9];
                    case 8:
                      e_4 = _a.sent();
                      logger.debug('cannot get updated Cognito User', e_4);
                      return [3 /*break*/, 9];
                    case 9:
                      dispatchAuthEvent('signIn', user, "A user " + user.getUsername() + " has been signed in");
                      resolve(user);
                      return [7 /*endfinally*/];
                    case 10:
                      return [2 /*return*/];
                  }
                });
              });
            },
            onFailure: function (err) {
              logger.debug('confirm signIn failure', err);
              reject(err);
            }
          }, mfaType, clientMetadata);
        });
      };
      AuthClass.prototype.completeNewPassword = function (user, password, requiredAttributes, clientMetadata) {
        var _this = this;
        if (requiredAttributes === void 0) {
          requiredAttributes = {};
        }
        if (clientMetadata === void 0) {
          clientMetadata = this._config.clientMetadata;
        }
        if (!password) {
          return this.rejectAuthError(_types__WEBPACK_IMPORTED_MODULE_10__.AuthErrorTypes.EmptyPassword);
        }
        var that = this;
        return new Promise(function (resolve, reject) {
          user.completeNewPasswordChallenge(password, requiredAttributes, {
            onSuccess: function (session) {
              return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__awaiter)(_this, void 0, void 0, function () {
                var cred, e_5;
                return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__generator)(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      logger.debug(session);
                      _a.label = 1;
                    case 1:
                      _a.trys.push([1, 4, 5, 6]);
                      return [4 /*yield*/, this.Credentials.clear()];
                    case 2:
                      _a.sent();
                      return [4 /*yield*/, this.Credentials.set(session, 'session')];
                    case 3:
                      cred = _a.sent();
                      logger.debug('succeed to get cognito credentials', cred);
                      return [3 /*break*/, 6];
                    case 4:
                      e_5 = _a.sent();
                      logger.debug('cannot get cognito credentials', e_5);
                      return [3 /*break*/, 6];
                    case 5:
                      that.user = user;
                      dispatchAuthEvent('signIn', user, "A user " + user.getUsername() + " has been signed in");
                      resolve(user);
                      return [7 /*endfinally*/];
                    case 6:
                      return [2 /*return*/];
                  }
                });
              });
            },
            onFailure: function (err) {
              logger.debug('completeNewPassword failure', err);
              dispatchAuthEvent('completeNewPassword_failure', err, _this.user + " failed to complete the new password flow");
              reject(err);
            },
            mfaRequired: function (challengeName, challengeParam) {
              logger.debug('signIn MFA required');
              user['challengeName'] = challengeName;
              user['challengeParam'] = challengeParam;
              resolve(user);
            },
            mfaSetup: function (challengeName, challengeParam) {
              logger.debug('signIn mfa setup', challengeName);
              user['challengeName'] = challengeName;
              user['challengeParam'] = challengeParam;
              resolve(user);
            },
            totpRequired: function (challengeName, challengeParam) {
              logger.debug('signIn mfa setup', challengeName);
              user['challengeName'] = challengeName;
              user['challengeParam'] = challengeParam;
              resolve(user);
            }
          }, clientMetadata);
        });
      };
      /**
       * Send the answer to a custom challenge
       * @param {CognitoUser} user - The CognitoUser object
       * @param {String} challengeResponses - The confirmation code
       */
      AuthClass.prototype.sendCustomChallengeAnswer = function (user, challengeResponses, clientMetadata) {
        var _this = this;
        if (clientMetadata === void 0) {
          clientMetadata = this._config.clientMetadata;
        }
        if (!this.userPool) {
          return this.rejectNoUserPool();
        }
        if (!challengeResponses) {
          return this.rejectAuthError(_types__WEBPACK_IMPORTED_MODULE_10__.AuthErrorTypes.EmptyChallengeResponse);
        }
        var that = this;
        return new Promise(function (resolve, reject) {
          user.sendCustomChallengeAnswer(challengeResponses, _this.authCallbacks(user, resolve, reject), clientMetadata);
        });
      };
      /**
       * Delete an authenticated users' attributes
       * @param {CognitoUser} - The currently logged in user object
       * @return {Promise}
       **/
      AuthClass.prototype.deleteUserAttributes = function (user, attributeNames) {
        var that = this;
        return new Promise(function (resolve, reject) {
          that.userSession(user).then(function (session) {
            user.deleteAttributes(attributeNames, function (err, result) {
              if (err) {
                return reject(err);
              } else {
                return resolve(result);
              }
            });
          });
        });
      };
      /**
       * Delete the current authenticated user
       * @return {Promise}
       **/
      // TODO: Check return type void
      AuthClass.prototype.deleteUser = function () {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__awaiter)(this, void 0, void 0, function () {
          var e_6, isSignedInHostedUI;
          var _this = this;
          return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__generator)(this, function (_a) {
            switch (_a.label) {
              case 0:
                _a.trys.push([0, 2,, 3]);
                return [4 /*yield*/, this._storageSync];
              case 1:
                _a.sent();
                return [3 /*break*/, 3];
              case 2:
                e_6 = _a.sent();
                logger.debug('Failed to sync cache info into memory', e_6);
                throw new Error(e_6);
              case 3:
                isSignedInHostedUI = this._oAuthHandler && this._storage.getItem('amplify-signin-with-hostedUI') === 'true';
                return [2 /*return*/, new Promise(function (res, rej) {
                  return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__awaiter)(_this, void 0, void 0, function () {
                    var user_1;
                    var _this = this;
                    return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__generator)(this, function (_a) {
                      if (this.userPool) {
                        user_1 = this.userPool.getCurrentUser();
                        if (!user_1) {
                          logger.debug('Failed to get user from user pool');
                          return [2 /*return*/, rej(new Error('No current user.'))];
                        } else {
                          user_1.getSession(function (err, session) {
                            return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__awaiter)(_this, void 0, void 0, function () {
                              var cleanUpError_4;
                              var _this = this;
                              return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__generator)(this, function (_a) {
                                switch (_a.label) {
                                  case 0:
                                    if (!err) return [3 /*break*/, 5];
                                    logger.debug('Failed to get the user session', err);
                                    if (!this.isSessionInvalid(err)) return [3 /*break*/, 4];
                                    _a.label = 1;
                                  case 1:
                                    _a.trys.push([1, 3,, 4]);
                                    return [4 /*yield*/, this.cleanUpInvalidSession(user_1)];
                                  case 2:
                                    _a.sent();
                                    return [3 /*break*/, 4];
                                  case 3:
                                    cleanUpError_4 = _a.sent();
                                    rej(new Error("Session is invalid due to: " + err.message + " and failed to clean up invalid session: " + cleanUpError_4.message));
                                    return [2 /*return*/];
                                  case 4:
                                    return [2 /*return*/, rej(err)];
                                  case 5:
                                    user_1.deleteUser(function (err, result) {
                                      if (err) {
                                        rej(err);
                                      } else {
                                        dispatchAuthEvent('userDeleted', result, 'The authenticated user has been deleted.');
                                        user_1.signOut();
                                        _this.user = null;
                                        try {
                                          _this.cleanCachedItems(); // clean aws credentials
                                        } catch (e) {
                                          // TODO: change to rejects in refactor
                                          logger.debug('failed to clear cached items');
                                        }
                                        if (isSignedInHostedUI) {
                                          _this.oAuthSignOutRedirect(res, rej);
                                        } else {
                                          dispatchAuthEvent('signOut', _this.user, "A user has been signed out");
                                          res(result);
                                        }
                                      }
                                    });
                                    _a.label = 6;
                                  case 6:
                                    return [2 /*return*/];
                                }
                              });
                            });
                          });
                        }
                      } else {
                        logger.debug('no Congito User pool');
                        rej(new Error('Cognito User pool does not exist'));
                      }
                      return [2 /*return*/];
                    });
                  });
                })];
            }
          });
        });
      };
      /**
       * Update an authenticated users' attributes
       * @param {CognitoUser} - The currently logged in user object
       * @return {Promise}
       **/
      AuthClass.prototype.updateUserAttributes = function (user, attributes, clientMetadata) {
        var _this = this;
        if (clientMetadata === void 0) {
          clientMetadata = this._config.clientMetadata;
        }
        var attributeList = [];
        var that = this;
        return new Promise(function (resolve, reject) {
          that.userSession(user).then(function (session) {
            for (var key in attributes) {
              if (key !== 'sub' && key.indexOf('_verified') < 0) {
                var attr = {
                  Name: key,
                  Value: attributes[key]
                };
                attributeList.push(attr);
              }
            }
            user.updateAttributes(attributeList, function (err, result, details) {
              if (err) {
                dispatchAuthEvent('updateUserAttributes_failure', err, 'Failed to update attributes');
                return reject(err);
              } else {
                var attrs = _this.createUpdateAttributesResultList(attributes, details === null || details === void 0 ? void 0 : details.CodeDeliveryDetailsList);
                dispatchAuthEvent('updateUserAttributes', attrs, 'Attributes successfully updated');
                return resolve(result);
              }
            }, clientMetadata);
          });
        });
      };
      AuthClass.prototype.createUpdateAttributesResultList = function (attributes, codeDeliveryDetailsList) {
        var attrs = {};
        Object.keys(attributes).forEach(function (key) {
          attrs[key] = {
            isUpdated: true
          };
          var codeDeliveryDetails = codeDeliveryDetailsList === null || codeDeliveryDetailsList === void 0 ? void 0 : codeDeliveryDetailsList.find(function (value) {
            return value.AttributeName === key;
          });
          if (codeDeliveryDetails) {
            attrs[key].isUpdated = false;
            attrs[key].codeDeliveryDetails = codeDeliveryDetails;
          }
        });
        return attrs;
      };
      /**
       * Return user attributes
       * @param {Object} user - The CognitoUser object
       * @return - A promise resolves to user attributes if success
       */
      AuthClass.prototype.userAttributes = function (user) {
        var _this = this;
        return new Promise(function (resolve, reject) {
          _this.userSession(user).then(function (session) {
            user.getUserAttributes(function (err, attributes) {
              if (err) {
                reject(err);
              } else {
                resolve(attributes);
              }
            });
          });
        });
      };
      AuthClass.prototype.verifiedContact = function (user) {
        var that = this;
        return this.userAttributes(user).then(function (attributes) {
          var attrs = that.attributesToObject(attributes);
          var unverified = {};
          var verified = {};
          if (attrs['email']) {
            if (attrs['email_verified']) {
              verified['email'] = attrs['email'];
            } else {
              unverified['email'] = attrs['email'];
            }
          }
          if (attrs['phone_number']) {
            if (attrs['phone_number_verified']) {
              verified['phone_number'] = attrs['phone_number'];
            } else {
              unverified['phone_number'] = attrs['phone_number'];
            }
          }
          return {
            verified: verified,
            unverified: unverified
          };
        });
      };
      AuthClass.prototype.isErrorWithMessage = function (err) {
        return typeof err === 'object' && Object.prototype.hasOwnProperty.call(err, 'message');
      };
      // Session revoked by another app
      AuthClass.prototype.isTokenRevokedError = function (err) {
        return this.isErrorWithMessage(err) && err.message === 'Access Token has been revoked';
      };
      AuthClass.prototype.isRefreshTokenRevokedError = function (err) {
        return this.isErrorWithMessage(err) && err.message === 'Refresh Token has been revoked';
      };
      AuthClass.prototype.isUserDisabledError = function (err) {
        return this.isErrorWithMessage(err) && err.message === 'User is disabled.';
      };
      AuthClass.prototype.isUserDoesNotExistError = function (err) {
        return this.isErrorWithMessage(err) && err.message === 'User does not exist.';
      };
      AuthClass.prototype.isRefreshTokenExpiredError = function (err) {
        return this.isErrorWithMessage(err) && err.message === 'Refresh Token has expired';
      };
      AuthClass.prototype.isPasswordResetRequiredError = function (err) {
        return this.isErrorWithMessage(err) && err.message === 'Password reset required for the user';
      };
      AuthClass.prototype.isSignedInHostedUI = function () {
        return this._oAuthHandler && this._storage.getItem('amplify-signin-with-hostedUI') === 'true';
      };
      AuthClass.prototype.isSessionInvalid = function (err) {
        return this.isUserDisabledError(err) || this.isUserDoesNotExistError(err) || this.isTokenRevokedError(err) || this.isRefreshTokenRevokedError(err) || this.isRefreshTokenExpiredError(err) || this.isPasswordResetRequiredError(err);
      };
      AuthClass.prototype.cleanUpInvalidSession = function (user) {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__awaiter)(this, void 0, void 0, function () {
          var e_7;
          var _this = this;
          return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__generator)(this, function (_a) {
            switch (_a.label) {
              case 0:
                user.signOut();
                this.user = null;
                _a.label = 1;
              case 1:
                _a.trys.push([1, 3,, 4]);
                return [4 /*yield*/, this.cleanCachedItems()];
              case 2:
                _a.sent(); // clean aws credentials
                return [3 /*break*/, 4];
              case 3:
                e_7 = _a.sent();
                logger.debug('failed to clear cached items');
                return [3 /*break*/, 4];
              case 4:
                if (this.isSignedInHostedUI()) {
                  return [2 /*return*/, new Promise(function (res, rej) {
                    _this.oAuthSignOutRedirect(res, rej);
                  })];
                } else {
                  dispatchAuthEvent('signOut', this.user, "A user has been signed out");
                }
                return [2 /*return*/];
            }
          });
        });
      };
      /**
       * Get current authenticated user
       * @return - A promise resolves to current authenticated CognitoUser if success
       */
      AuthClass.prototype.currentUserPoolUser = function (params) {
        var _this = this;
        if (!this.userPool) {
          return this.rejectNoUserPool();
        }
        return new Promise(function (res, rej) {
          _this._storageSync.then(function () {
            return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__awaiter)(_this, void 0, void 0, function () {
              var user, session, bypassCache, clientMetadata, _a, scope, err_1;
              var _this = this;
              return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__generator)(this, function (_b) {
                switch (_b.label) {
                  case 0:
                    if (!this.isOAuthInProgress()) return [3 /*break*/, 2];
                    logger.debug('OAuth signIn in progress, waiting for resolution...');
                    return [4 /*yield*/, new Promise(function (res) {
                      var timeoutId = setTimeout(function () {
                        logger.debug('OAuth signIn in progress timeout');
                        _aws_amplify_core__WEBPACK_IMPORTED_MODULE_4__.Hub.remove('auth', hostedUISignCallback);
                        res();
                      }, OAUTH_FLOW_MS_TIMEOUT);
                      _aws_amplify_core__WEBPACK_IMPORTED_MODULE_4__.Hub.listen('auth', hostedUISignCallback);
                      function hostedUISignCallback(_a) {
                        var payload = _a.payload;
                        var event = payload.event;
                        if (event === 'cognitoHostedUI' || event === 'cognitoHostedUI_failure') {
                          logger.debug("OAuth signIn resolved: " + event);
                          clearTimeout(timeoutId);
                          _aws_amplify_core__WEBPACK_IMPORTED_MODULE_4__.Hub.remove('auth', hostedUISignCallback);
                          res();
                        }
                      }
                    })];
                  case 1:
                    _b.sent();
                    _b.label = 2;
                  case 2:
                    user = this.userPool.getCurrentUser();
                    if (!user) {
                      logger.debug('Failed to get user from user pool');
                      rej('No current user');
                      return [2 /*return*/];
                    }
                    _b.label = 3;
                  case 3:
                    _b.trys.push([3, 7,, 8]);
                    return [4 /*yield*/, this._userSession(user)];
                  case 4:
                    session = _b.sent();
                    bypassCache = params ? params.bypassCache : false;
                    if (!bypassCache) return [3 /*break*/, 6];
                    return [4 /*yield*/, this.Credentials.clear()];
                  case 5:
                    _b.sent();
                    _b.label = 6;
                  case 6:
                    clientMetadata = this._config.clientMetadata;
                    _a = session.getAccessToken().decodePayload().scope, scope = _a === void 0 ? '' : _a;
                    if (scope.split(' ').includes(USER_ADMIN_SCOPE)) {
                      user.getUserData(function (err, data) {
                        return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__awaiter)(_this, void 0, void 0, function () {
                          var cleanUpError_5, preferredMFA, attributeList, i, attribute, userAttribute, attributes;
                          return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__generator)(this, function (_a) {
                            switch (_a.label) {
                              case 0:
                                if (!err) return [3 /*break*/, 7];
                                logger.debug('getting user data failed', err);
                                if (!this.isSessionInvalid(err)) return [3 /*break*/, 5];
                                _a.label = 1;
                              case 1:
                                _a.trys.push([1, 3,, 4]);
                                return [4 /*yield*/, this.cleanUpInvalidSession(user)];
                              case 2:
                                _a.sent();
                                return [3 /*break*/, 4];
                              case 3:
                                cleanUpError_5 = _a.sent();
                                rej(new Error("Session is invalid due to: " + err.message + " and failed to clean up invalid session: " + cleanUpError_5.message));
                                return [2 /*return*/];
                              case 4:
                                rej(err);
                                return [3 /*break*/, 6];
                              case 5:
                                res(user);
                                _a.label = 6;
                              case 6:
                                return [2 /*return*/];
                              case 7:
                                preferredMFA = data.PreferredMfaSetting || 'NOMFA';
                                attributeList = [];
                                for (i = 0; i < data.UserAttributes.length; i++) {
                                  attribute = {
                                    Name: data.UserAttributes[i].Name,
                                    Value: data.UserAttributes[i].Value
                                  };
                                  userAttribute = new amazon_cognito_identity_js__WEBPACK_IMPORTED_MODULE_0__.CognitoUserAttribute(attribute);
                                  attributeList.push(userAttribute);
                                }
                                attributes = this.attributesToObject(attributeList);
                                Object.assign(user, {
                                  attributes: attributes,
                                  preferredMFA: preferredMFA
                                });
                                return [2 /*return*/, res(user)];
                            }
                          });
                        });
                      }, {
                        bypassCache: bypassCache,
                        clientMetadata: clientMetadata
                      });
                    } else {
                      logger.debug("Unable to get the user data because the " + USER_ADMIN_SCOPE + " " + "is not in the scopes of the access token");
                      return [2 /*return*/, res(user)];
                    }
                    return [3 /*break*/, 8];
                  case 7:
                    err_1 = _b.sent();
                    rej(err_1);
                    return [3 /*break*/, 8];
                  case 8:
                    return [2 /*return*/];
                }
              });
            });
          }).catch(function (e) {
            logger.debug('Failed to sync cache info into memory', e);
            return rej(e);
          });
        });
      };
      AuthClass.prototype.isOAuthInProgress = function () {
        return this.oAuthFlowInProgress;
      };
      /**
       * Get current authenticated user
       * @param {CurrentUserOpts} - options for getting the current user
       * @return - A promise resolves to current authenticated CognitoUser if success
       */
      AuthClass.prototype.currentAuthenticatedUser = function (params) {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__awaiter)(this, void 0, void 0, function () {
          var federatedUser, e_8, federatedInfo, user, e_9;
          return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__generator)(this, function (_a) {
            switch (_a.label) {
              case 0:
                logger.debug('getting current authenticated user');
                federatedUser = null;
                _a.label = 1;
              case 1:
                _a.trys.push([1, 3,, 4]);
                return [4 /*yield*/, this._storageSync];
              case 2:
                _a.sent();
                return [3 /*break*/, 4];
              case 3:
                e_8 = _a.sent();
                logger.debug('Failed to sync cache info into memory', e_8);
                throw e_8;
              case 4:
                try {
                  federatedInfo = JSON.parse(this._storage.getItem('aws-amplify-federatedInfo'));
                  if (federatedInfo) {
                    federatedUser = (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_13__.__assign)({}, federatedInfo.user), {
                      token: federatedInfo.token
                    });
                  }
                } catch (e) {
                  logger.debug('cannot load federated user from auth storage');
                }
                if (!federatedUser) return [3 /*break*/, 5];
                this.user = federatedUser;
                logger.debug('get current authenticated federated user', this.user);
                return [2 /*return*/, this.user];
              case 5:
                logger.debug('get current authenticated userpool user');
                user = null;
                _a.label = 6;
              case 6:
                _a.trys.push([6, 8,, 9]);
                return [4 /*yield*/, this.currentUserPoolUser(params)];
              case 7:
                user = _a.sent();
                return [3 /*break*/, 9];
              case 8:
                e_9 = _a.sent();
                if (e_9 === 'No userPool') {
                  logger.error('Cannot get the current user because the user pool is missing. ' + 'Please make sure the Auth module is configured with a valid Cognito User Pool ID');
                }
                logger.debug('The user is not authenticated by the error', e_9);
                return [2 /*return*/, Promise.reject('The user is not authenticated')];
              case 9:
                this.user = user;
                return [2 /*return*/, this.user];
            }
          });
        });
      };
      /**
       * Get current user's session
       * @return - A promise resolves to session object if success
       */
      AuthClass.prototype.currentSession = function () {
        var that = this;
        logger.debug('Getting current session');
        // Purposely not calling the reject method here because we don't need a console error
        if (!this.userPool) {
          return Promise.reject(new Error('No User Pool in the configuration.'));
        }
        return new Promise(function (res, rej) {
          that.currentUserPoolUser().then(function (user) {
            that.userSession(user).then(function (session) {
              res(session);
              return;
            }).catch(function (e) {
              logger.debug('Failed to get the current session', e);
              rej(e);
              return;
            });
          }).catch(function (e) {
            logger.debug('Failed to get the current user', e);
            rej(e);
            return;
          });
        });
      };
      AuthClass.prototype._userSession = function (user) {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__awaiter)(this, void 0, void 0, function () {
          var clientMetadata, userSession;
          var _this = this;
          return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__generator)(this, function (_a) {
            switch (_a.label) {
              case 0:
                if (!user) {
                  logger.debug('the user is null');
                  return [2 /*return*/, this.rejectAuthError(_types__WEBPACK_IMPORTED_MODULE_10__.AuthErrorTypes.NoUserSession)];
                }
                clientMetadata = this._config.clientMetadata;
                // Debouncing the concurrent userSession calls by caching the promise.
                // This solution assumes users will always call this function with the same CognitoUser instance.
                if (this.inflightSessionPromiseCounter === 0) {
                  this.inflightSessionPromise = new Promise(function (res, rej) {
                    user.getSession(function (err, session) {
                      return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__awaiter)(_this, void 0, void 0, function () {
                        var cleanUpError_6;
                        return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__generator)(this, function (_a) {
                          switch (_a.label) {
                            case 0:
                              if (!err) return [3 /*break*/, 5];
                              logger.debug('Failed to get the session from user', user);
                              if (!this.isSessionInvalid(err)) return [3 /*break*/, 4];
                              _a.label = 1;
                            case 1:
                              _a.trys.push([1, 3,, 4]);
                              return [4 /*yield*/, this.cleanUpInvalidSession(user)];
                            case 2:
                              _a.sent();
                              return [3 /*break*/, 4];
                            case 3:
                              cleanUpError_6 = _a.sent();
                              rej(new Error("Session is invalid due to: " + err.message + " and failed to clean up invalid session: " + cleanUpError_6.message));
                              return [2 /*return*/];
                            case 4:
                              rej(err);
                              return [2 /*return*/];
                            case 5:
                              logger.debug('Succeed to get the user session', session);
                              res(session);
                              return [2 /*return*/];
                          }
                        });
                      });
                    }, {
                      clientMetadata: clientMetadata
                    });
                  });
                }
                this.inflightSessionPromiseCounter++;
                _a.label = 1;
              case 1:
                _a.trys.push([1,, 3, 4]);
                return [4 /*yield*/, this.inflightSessionPromise];
              case 2:
                userSession = _a.sent();
                // Set private member. Avoid user.setSignInUserSession() to prevent excessive localstorage refresh.
                // @ts-ignore
                user.signInUserSession = userSession;
                return [2 /*return*/, userSession];
              case 3:
                this.inflightSessionPromiseCounter--;
                return [7 /*endfinally*/];
              case 4:
                return [2 /*return*/];
            }
          });
        });
      };
      /**
       * Get the corresponding user session
       * @param {Object} user - The CognitoUser object
       * @return - A promise resolves to the session
       */
      AuthClass.prototype.userSession = function (user) {
        return this._userSession(user);
      };
      /**
       * Get authenticated credentials of current user.
       * @return - A promise resolves to be current user's credentials
       */
      AuthClass.prototype.currentUserCredentials = function () {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__awaiter)(this, void 0, void 0, function () {
          var e_10, federatedInfo;
          var _this = this;
          return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__generator)(this, function (_a) {
            switch (_a.label) {
              case 0:
                logger.debug('Getting current user credentials');
                _a.label = 1;
              case 1:
                _a.trys.push([1, 3,, 4]);
                return [4 /*yield*/, this._storageSync];
              case 2:
                _a.sent();
                return [3 /*break*/, 4];
              case 3:
                e_10 = _a.sent();
                logger.debug('Failed to sync cache info into memory', e_10);
                throw e_10;
              case 4:
                federatedInfo = null;
                try {
                  federatedInfo = JSON.parse(this._storage.getItem('aws-amplify-federatedInfo'));
                } catch (e) {
                  logger.debug('failed to get or parse item aws-amplify-federatedInfo', e);
                }
                if (federatedInfo) {
                  // refresh the jwt token here if necessary
                  return [2 /*return*/, this.Credentials.refreshFederatedToken(federatedInfo)];
                } else {
                  return [2 /*return*/, this.currentSession().then(function (session) {
                    logger.debug('getting session success', session);
                    return _this.Credentials.set(session, 'session');
                  }).catch(function () {
                    logger.debug('getting guest credentials');
                    return _this.Credentials.set(null, 'guest');
                  })];
                }
                return [2 /*return*/];
            }
          });
        });
      };
      AuthClass.prototype.currentCredentials = function () {
        logger.debug('getting current credentials');
        return this.Credentials.get();
      };
      /**
       * Initiate an attribute confirmation request
       * @param {Object} user - The CognitoUser
       * @param {Object} attr - The attributes to be verified
       * @return - A promise resolves to callback data if success
       */
      AuthClass.prototype.verifyUserAttribute = function (user, attr, clientMetadata) {
        if (clientMetadata === void 0) {
          clientMetadata = this._config.clientMetadata;
        }
        return new Promise(function (resolve, reject) {
          user.getAttributeVerificationCode(attr, {
            onSuccess: function (success) {
              return resolve(success);
            },
            onFailure: function (err) {
              return reject(err);
            }
          }, clientMetadata);
        });
      };
      /**
       * Confirm an attribute using a confirmation code
       * @param {Object} user - The CognitoUser
       * @param {Object} attr - The attribute to be verified
       * @param {String} code - The confirmation code
       * @return - A promise resolves to callback data if success
       */
      AuthClass.prototype.verifyUserAttributeSubmit = function (user, attr, code) {
        if (!code) {
          return this.rejectAuthError(_types__WEBPACK_IMPORTED_MODULE_10__.AuthErrorTypes.EmptyCode);
        }
        return new Promise(function (resolve, reject) {
          user.verifyAttribute(attr, code, {
            onSuccess: function (data) {
              resolve(data);
              return;
            },
            onFailure: function (err) {
              reject(err);
              return;
            }
          });
        });
      };
      AuthClass.prototype.verifyCurrentUserAttribute = function (attr) {
        var that = this;
        return that.currentUserPoolUser().then(function (user) {
          return that.verifyUserAttribute(user, attr);
        });
      };
      /**
       * Confirm current user's attribute using a confirmation code
       * @param {Object} attr - The attribute to be verified
       * @param {String} code - The confirmation code
       * @return - A promise resolves to callback data if success
       */
      AuthClass.prototype.verifyCurrentUserAttributeSubmit = function (attr, code) {
        var that = this;
        return that.currentUserPoolUser().then(function (user) {
          return that.verifyUserAttributeSubmit(user, attr, code);
        });
      };
      AuthClass.prototype.cognitoIdentitySignOut = function (opts, user) {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__awaiter)(this, void 0, void 0, function () {
          var e_11, isSignedInHostedUI;
          var _this = this;
          return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__generator)(this, function (_a) {
            switch (_a.label) {
              case 0:
                _a.trys.push([0, 2,, 3]);
                return [4 /*yield*/, this._storageSync];
              case 1:
                _a.sent();
                return [3 /*break*/, 3];
              case 2:
                e_11 = _a.sent();
                logger.debug('Failed to sync cache info into memory', e_11);
                throw e_11;
              case 3:
                isSignedInHostedUI = this._oAuthHandler && this._storage.getItem('amplify-signin-with-hostedUI') === 'true';
                return [2 /*return*/, new Promise(function (res, rej) {
                  if (opts && opts.global) {
                    logger.debug('user global sign out', user);
                    // in order to use global signout
                    // we must validate the user as an authenticated user by using getSession
                    var clientMetadata = _this._config.clientMetadata; // TODO: verify behavior if this is override during signIn
                    user.getSession(function (err, result) {
                      return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__awaiter)(_this, void 0, void 0, function () {
                        var cleanUpError_7;
                        var _this = this;
                        return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__generator)(this, function (_a) {
                          switch (_a.label) {
                            case 0:
                              if (!err) return [3 /*break*/, 5];
                              logger.debug('failed to get the user session', err);
                              if (!this.isSessionInvalid(err)) return [3 /*break*/, 4];
                              _a.label = 1;
                            case 1:
                              _a.trys.push([1, 3,, 4]);
                              return [4 /*yield*/, this.cleanUpInvalidSession(user)];
                            case 2:
                              _a.sent();
                              return [3 /*break*/, 4];
                            case 3:
                              cleanUpError_7 = _a.sent();
                              rej(new Error("Session is invalid due to: " + err.message + " and failed to clean up invalid session: " + cleanUpError_7.message));
                              return [2 /*return*/];
                            case 4:
                              return [2 /*return*/, rej(err)];
                            case 5:
                              user.globalSignOut({
                                onSuccess: function (data) {
                                  logger.debug('global sign out success');
                                  if (isSignedInHostedUI) {
                                    _this.oAuthSignOutRedirect(res, rej);
                                  } else {
                                    return res();
                                  }
                                },
                                onFailure: function (err) {
                                  logger.debug('global sign out failed', err);
                                  return rej(err);
                                }
                              });
                              return [2 /*return*/];
                          }
                        });
                      });
                    }, {
                      clientMetadata: clientMetadata
                    });
                  } else {
                    logger.debug('user sign out', user);
                    user.signOut(function () {
                      if (isSignedInHostedUI) {
                        _this.oAuthSignOutRedirect(res, rej);
                      } else {
                        return res();
                      }
                    });
                  }
                })];
            }
          });
        });
      };
      AuthClass.prototype.oAuthSignOutRedirect = function (resolve, reject) {
        var isBrowser = (0,_aws_amplify_core__WEBPACK_IMPORTED_MODULE_14__.browserOrNode)().isBrowser;
        if (isBrowser) {
          this.oAuthSignOutRedirectOrReject(reject);
        } else {
          this.oAuthSignOutAndResolve(resolve);
        }
      };
      AuthClass.prototype.oAuthSignOutAndResolve = function (resolve) {
        this._oAuthHandler.signOut();
        resolve();
      };
      AuthClass.prototype.oAuthSignOutRedirectOrReject = function (reject) {
        this._oAuthHandler.signOut(); // this method redirects url
        // App should be redirected to another url otherwise it will reject
        setTimeout(function () {
          return reject(Error('Signout timeout fail'));
        }, 3000);
      };
      /**
       * Sign out method
       * @
       * @return - A promise resolved if success
       */
      AuthClass.prototype.signOut = function (opts) {
        if (opts === void 0) {
          opts = {};
        }
        return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__awaiter)(this, void 0, void 0, function () {
          var e_12, e_13, user;
          return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__generator)(this, function (_a) {
            switch (_a.label) {
              case 0:
                _a.trys.push([0, 2,, 3]);
                return [4 /*yield*/, this.cleanCachedItems()];
              case 1:
                _a.sent();
                return [3 /*break*/, 3];
              case 2:
                e_12 = _a.sent();
                logger.debug('failed to clear cached items');
                return [3 /*break*/, 3];
              case 3:
                if (!this.userPool) return [3 /*break*/, 11];
                _a.label = 4;
              case 4:
                _a.trys.push([4, 6,, 7]);
                return [4 /*yield*/, this._storageSync];
              case 5:
                _a.sent();
                return [3 /*break*/, 7];
              case 6:
                e_13 = _a.sent();
                logger.debug('Failed to sync cache info into memory', e_13);
                throw e_13;
              case 7:
                user = this.userPool.getCurrentUser();
                if (!user) return [3 /*break*/, 9];
                return [4 /*yield*/, this.cognitoIdentitySignOut(opts, user)];
              case 8:
                _a.sent();
                return [3 /*break*/, 10];
              case 9:
                logger.debug('no current Cognito user');
                _a.label = 10;
              case 10:
                return [3 /*break*/, 12];
              case 11:
                logger.debug('no Cognito User pool');
                _a.label = 12;
              case 12:
                /**
                 * Note for future refactor - no reliable way to get username with
                 * Cognito User Pools vs Identity when federating with Social Providers
                 * This is why we need a well structured session object that can be inspected
                 * and information passed back in the message below for Hub dispatch
                 */
                dispatchAuthEvent('signOut', this.user, "A user has been signed out");
                this.user = null;
                return [2 /*return*/];
            }
          });
        });
      };
      AuthClass.prototype.cleanCachedItems = function () {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__awaiter)(this, void 0, void 0, function () {
          return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__generator)(this, function (_a) {
            switch (_a.label) {
              case 0:
                // clear cognito cached item
                return [4 /*yield*/, this.Credentials.clear()];
              case 1:
                // clear cognito cached item
                _a.sent();
                return [2 /*return*/];
            }
          });
        });
      };
      /**
       * Change a password for an authenticated user
       * @param {Object} user - The CognitoUser object
       * @param {String} oldPassword - the current password
       * @param {String} newPassword - the requested new password
       * @return - A promise resolves if success
       */
      AuthClass.prototype.changePassword = function (user, oldPassword, newPassword, clientMetadata) {
        var _this = this;
        if (clientMetadata === void 0) {
          clientMetadata = this._config.clientMetadata;
        }
        return new Promise(function (resolve, reject) {
          _this.userSession(user).then(function (session) {
            user.changePassword(oldPassword, newPassword, function (err, data) {
              if (err) {
                logger.debug('change password failure', err);
                return reject(err);
              } else {
                return resolve(data);
              }
            }, clientMetadata);
          });
        });
      };
      /**
       * Initiate a forgot password request
       * @param {String} username - the username to change password
       * @return - A promise resolves if success
       */
      AuthClass.prototype.forgotPassword = function (username, clientMetadata) {
        if (clientMetadata === void 0) {
          clientMetadata = this._config.clientMetadata;
        }
        if (!this.userPool) {
          return this.rejectNoUserPool();
        }
        if (!username) {
          return this.rejectAuthError(_types__WEBPACK_IMPORTED_MODULE_10__.AuthErrorTypes.EmptyUsername);
        }
        var user = this.createCognitoUser(username);
        return new Promise(function (resolve, reject) {
          user.forgotPassword({
            onSuccess: function () {
              resolve();
              return;
            },
            onFailure: function (err) {
              logger.debug('forgot password failure', err);
              dispatchAuthEvent('forgotPassword_failure', err, username + " forgotPassword failed");
              reject(err);
              return;
            },
            inputVerificationCode: function (data) {
              dispatchAuthEvent('forgotPassword', user, username + " has initiated forgot password flow");
              resolve(data);
              return;
            }
          }, clientMetadata);
        });
      };
      /**
       * Confirm a new password using a confirmation Code
       * @param {String} username - The username
       * @param {String} code - The confirmation code
       * @param {String} password - The new password
       * @return - A promise that resolves if success
       */
      AuthClass.prototype.forgotPasswordSubmit = function (username, code, password, clientMetadata) {
        if (clientMetadata === void 0) {
          clientMetadata = this._config.clientMetadata;
        }
        if (!this.userPool) {
          return this.rejectNoUserPool();
        }
        if (!username) {
          return this.rejectAuthError(_types__WEBPACK_IMPORTED_MODULE_10__.AuthErrorTypes.EmptyUsername);
        }
        if (!code) {
          return this.rejectAuthError(_types__WEBPACK_IMPORTED_MODULE_10__.AuthErrorTypes.EmptyCode);
        }
        if (!password) {
          return this.rejectAuthError(_types__WEBPACK_IMPORTED_MODULE_10__.AuthErrorTypes.EmptyPassword);
        }
        var user = this.createCognitoUser(username);
        return new Promise(function (resolve, reject) {
          user.confirmPassword(code, password, {
            onSuccess: function (success) {
              dispatchAuthEvent('forgotPasswordSubmit', user, username + " forgotPasswordSubmit successful");
              resolve(success);
              return;
            },
            onFailure: function (err) {
              dispatchAuthEvent('forgotPasswordSubmit_failure', err, username + " forgotPasswordSubmit failed");
              reject(err);
              return;
            }
          }, clientMetadata);
        });
      };
      /**
       * Get user information
       * @async
       * @return {Object }- current User's information
       */
      AuthClass.prototype.currentUserInfo = function () {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__awaiter)(this, void 0, void 0, function () {
          var source, user, attributes, userAttrs, credentials, e_14, info, err_2, user;
          return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__generator)(this, function (_a) {
            switch (_a.label) {
              case 0:
                source = this.Credentials.getCredSource();
                if (!(!source || source === 'aws' || source === 'userPool')) return [3 /*break*/, 9];
                return [4 /*yield*/, this.currentUserPoolUser().catch(function (err) {
                  return logger.error(err);
                })];
              case 1:
                user = _a.sent();
                if (!user) {
                  return [2 /*return*/, null];
                }
                _a.label = 2;
              case 2:
                _a.trys.push([2, 8,, 9]);
                return [4 /*yield*/, this.userAttributes(user)];
              case 3:
                attributes = _a.sent();
                userAttrs = this.attributesToObject(attributes);
                credentials = null;
                _a.label = 4;
              case 4:
                _a.trys.push([4, 6,, 7]);
                return [4 /*yield*/, this.currentCredentials()];
              case 5:
                credentials = _a.sent();
                return [3 /*break*/, 7];
              case 6:
                e_14 = _a.sent();
                logger.debug('Failed to retrieve credentials while getting current user info', e_14);
                return [3 /*break*/, 7];
              case 7:
                info = {
                  id: credentials ? credentials.identityId : undefined,
                  username: user.getUsername(),
                  attributes: userAttrs
                };
                return [2 /*return*/, info];
              case 8:
                err_2 = _a.sent();
                logger.error('currentUserInfo error', err_2);
                return [2 /*return*/, {}];
              case 9:
                if (source === 'federated') {
                  user = this.user;
                  return [2 /*return*/, user ? user : {}];
                }
                return [2 /*return*/];
            }
          });
        });
      };
      AuthClass.prototype.federatedSignIn = function (providerOrOptions, response, user) {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__awaiter)(this, void 0, void 0, function () {
          var options, provider, customState, client_id, redirect_uri, provider, loggedInUser, token, identity_id, expires_at, credentials, currentUser;
          return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__generator)(this, function (_a) {
            switch (_a.label) {
              case 0:
                if (!this._config.identityPoolId && !this._config.userPoolId) {
                  throw new Error("Federation requires either a User Pool or Identity Pool in config");
                }
                // Ensure backwards compatability
                if (typeof providerOrOptions === 'undefined') {
                  if (this._config.identityPoolId && !this._config.userPoolId) {
                    throw new Error("Federation with Identity Pools requires tokens passed as arguments");
                  }
                }
                if (!((0,_types__WEBPACK_IMPORTED_MODULE_10__.isFederatedSignInOptions)(providerOrOptions) || (0,_types__WEBPACK_IMPORTED_MODULE_10__.isFederatedSignInOptionsCustom)(providerOrOptions) || (0,_types__WEBPACK_IMPORTED_MODULE_10__.hasCustomState)(providerOrOptions) || typeof providerOrOptions === 'undefined')) return [3 /*break*/, 1];
                options = providerOrOptions || {
                  provider: _types__WEBPACK_IMPORTED_MODULE_10__.CognitoHostedUIIdentityProvider.Cognito
                };
                provider = (0,_types__WEBPACK_IMPORTED_MODULE_10__.isFederatedSignInOptions)(options) ? options.provider : options.customProvider;
                customState = (0,_types__WEBPACK_IMPORTED_MODULE_10__.isFederatedSignInOptions)(options) ? options.customState : options.customState;
                if (this._config.userPoolId) {
                  client_id = (0,_types__WEBPACK_IMPORTED_MODULE_10__.isCognitoHostedOpts)(this._config.oauth) ? this._config.userPoolWebClientId : this._config.oauth.clientID;
                  redirect_uri = (0,_types__WEBPACK_IMPORTED_MODULE_10__.isCognitoHostedOpts)(this._config.oauth) ? this._config.oauth.redirectSignIn : this._config.oauth.redirectUri;
                  this._oAuthHandler.oauthSignIn(this._config.oauth.responseType, this._config.oauth.domain, redirect_uri, client_id, provider, customState);
                }
                return [3 /*break*/, 4];
              case 1:
                provider = providerOrOptions;
                // To check if the user is already logged in
                try {
                  loggedInUser = JSON.stringify(JSON.parse(this._storage.getItem('aws-amplify-federatedInfo')).user);
                  if (loggedInUser) {
                    logger.warn("There is already a signed in user: " + loggedInUser + " in your app.\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tYou should not call Auth.federatedSignIn method again as it may cause unexpected behavior.");
                  }
                } catch (e) {}
                token = response.token, identity_id = response.identity_id, expires_at = response.expires_at;
                return [4 /*yield*/, this.Credentials.set({
                  provider: provider,
                  token: token,
                  identity_id: identity_id,
                  user: user,
                  expires_at: expires_at
                }, 'federation')];
              case 2:
                credentials = _a.sent();
                return [4 /*yield*/, this.currentAuthenticatedUser()];
              case 3:
                currentUser = _a.sent();
                dispatchAuthEvent('signIn', currentUser, "A user " + currentUser.username + " has been signed in");
                logger.debug('federated sign in credentials', credentials);
                return [2 /*return*/, credentials];
              case 4:
                return [2 /*return*/];
            }
          });
        });
      };
      /**
       * Used to complete the OAuth flow with or without the Cognito Hosted UI
       * @param {String} URL - optional parameter for customers to pass in the response URL
       */
      AuthClass.prototype._handleAuthResponse = function (URL) {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__awaiter)(this, void 0, void 0, function () {
          var currentUrl, hasCodeOrError, hasTokenOrError, _a, accessToken, idToken, refreshToken, state, session, credentials, isCustomStateIncluded, currentUser, customState, err_3;
          return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__generator)(this, function (_b) {
            switch (_b.label) {
              case 0:
                if (this.oAuthFlowInProgress) {
                  logger.debug("Skipping URL " + URL + " current flow in progress");
                  return [2 /*return*/];
                }
                _b.label = 1;
              case 1:
                _b.trys.push([1,, 8, 9]);
                this.oAuthFlowInProgress = true;
                if (!this._config.userPoolId) {
                  throw new Error("OAuth responses require a User Pool defined in config");
                }
                dispatchAuthEvent('parsingCallbackUrl', {
                  url: URL
                }, "The callback url is being parsed");
                currentUrl = URL || ((0,_aws_amplify_core__WEBPACK_IMPORTED_MODULE_14__.browserOrNode)().isBrowser ? window.location.href : '');
                hasCodeOrError = !!((0,url__WEBPACK_IMPORTED_MODULE_2__.parse)(currentUrl).query || '').split('&').map(function (entry) {
                  return entry.split('=');
                }).find(function (_a) {
                  var _b = (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__read)(_a, 1),
                    k = _b[0];
                  return k === 'code' || k === 'error';
                });
                hasTokenOrError = !!((0,url__WEBPACK_IMPORTED_MODULE_2__.parse)(currentUrl).hash || '#').substr(1).split('&').map(function (entry) {
                  return entry.split('=');
                }).find(function (_a) {
                  var _b = (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__read)(_a, 1),
                    k = _b[0];
                  return k === 'access_token' || k === 'error';
                });
                if (!(hasCodeOrError || hasTokenOrError)) return [3 /*break*/, 7];
                this._storage.setItem('amplify-redirected-from-hosted-ui', 'true');
                _b.label = 2;
              case 2:
                _b.trys.push([2, 6,, 7]);
                return [4 /*yield*/, this._oAuthHandler.handleAuthResponse(currentUrl)];
              case 3:
                _a = _b.sent(), accessToken = _a.accessToken, idToken = _a.idToken, refreshToken = _a.refreshToken, state = _a.state;
                session = new amazon_cognito_identity_js__WEBPACK_IMPORTED_MODULE_0__.CognitoUserSession({
                  IdToken: new amazon_cognito_identity_js__WEBPACK_IMPORTED_MODULE_0__.CognitoIdToken({
                    IdToken: idToken
                  }),
                  RefreshToken: new amazon_cognito_identity_js__WEBPACK_IMPORTED_MODULE_0__.CognitoRefreshToken({
                    RefreshToken: refreshToken
                  }),
                  AccessToken: new amazon_cognito_identity_js__WEBPACK_IMPORTED_MODULE_0__.CognitoAccessToken({
                    AccessToken: accessToken
                  })
                });
                credentials = void 0;
                if (!this._config.identityPoolId) return [3 /*break*/, 5];
                return [4 /*yield*/, this.Credentials.set(session, 'session')];
              case 4:
                credentials = _b.sent();
                logger.debug('AWS credentials', credentials);
                _b.label = 5;
              case 5:
                isCustomStateIncluded = /-/.test(state);
                currentUser = this.createCognitoUser(session.getIdToken().decodePayload()['cognito:username']);
                // This calls cacheTokens() in Cognito SDK
                currentUser.setSignInUserSession(session);
                if (window && typeof window.history !== 'undefined') {
                  window.history.replaceState(window.history.state, '', this._config.oauth.redirectSignIn);
                }
                dispatchAuthEvent('signIn', currentUser, "A user " + currentUser.getUsername() + " has been signed in");
                dispatchAuthEvent('cognitoHostedUI', currentUser, "A user " + currentUser.getUsername() + " has been signed in via Cognito Hosted UI");
                if (isCustomStateIncluded) {
                  customState = state.split('-').splice(1).join('-');
                  dispatchAuthEvent('customOAuthState', (0,_aws_amplify_core__WEBPACK_IMPORTED_MODULE_15__.urlSafeDecode)(customState), "State for user " + currentUser.getUsername());
                }
                //#endregion
                return [2 /*return*/, credentials];
              case 6:
                err_3 = _b.sent();
                logger.debug('Error in cognito hosted auth response', err_3);
                // Just like a successful handling of `?code`, replace the window history to "dispose" of the `code`.
                // Otherwise, reloading the page will throw errors as the `code` has already been spent.
                if (window && typeof window.history !== 'undefined') {
                  window.history.replaceState(window.history.state, '', this._config.oauth.redirectSignIn);
                }
                dispatchAuthEvent('signIn_failure', err_3, "The OAuth response flow failed");
                dispatchAuthEvent('cognitoHostedUI_failure', err_3, "A failure occurred when returning to the Cognito Hosted UI");
                dispatchAuthEvent('customState_failure', err_3, "A failure occurred when returning state");
                return [3 /*break*/, 7];
              case 7:
                return [3 /*break*/, 9];
              case 8:
                this.oAuthFlowInProgress = false;
                return [7 /*endfinally*/];
              case 9:
                return [2 /*return*/];
            }
          });
        });
      };
      /**
       * Compact version of credentials
       * @param {Object} credentials
       * @return {Object} - Credentials
       */
      AuthClass.prototype.essentialCredentials = function (credentials) {
        return {
          accessKeyId: credentials.accessKeyId,
          sessionToken: credentials.sessionToken,
          secretAccessKey: credentials.secretAccessKey,
          identityId: credentials.identityId,
          authenticated: credentials.authenticated
        };
      };
      AuthClass.prototype.attributesToObject = function (attributes) {
        var _this = this;
        var obj = {};
        if (attributes) {
          attributes.map(function (attribute) {
            if (attribute.Name === 'email_verified' || attribute.Name === 'phone_number_verified') {
              obj[attribute.Name] = _this.isTruthyString(attribute.Value) || attribute.Value === true;
            } else {
              obj[attribute.Name] = attribute.Value;
            }
          });
        }
        return obj;
      };
      AuthClass.prototype.isTruthyString = function (value) {
        return typeof value.toLowerCase === 'function' && value.toLowerCase() === 'true';
      };
      AuthClass.prototype.createCognitoUser = function (username) {
        var userData = {
          Username: username,
          Pool: this.userPool
        };
        userData.Storage = this._storage;
        var authenticationFlowType = this._config.authenticationFlowType;
        var user = new amazon_cognito_identity_js__WEBPACK_IMPORTED_MODULE_0__.CognitoUser(userData);
        if (authenticationFlowType) {
          user.setAuthenticationFlowType(authenticationFlowType);
        }
        return user;
      };
      AuthClass.prototype._isValidAuthStorage = function (obj) {
        // We need to check if the obj has the functions of Storage
        return !!obj && typeof obj.getItem === 'function' && typeof obj.setItem === 'function' && typeof obj.removeItem === 'function' && typeof obj.clear === 'function';
      };
      AuthClass.prototype.noUserPoolErrorHandler = function (config) {
        if (config) {
          if (!config.userPoolId || !config.identityPoolId) {
            return _types__WEBPACK_IMPORTED_MODULE_10__.AuthErrorTypes.MissingAuthConfig;
          }
        }
        return _types__WEBPACK_IMPORTED_MODULE_10__.AuthErrorTypes.NoConfig;
      };
      AuthClass.prototype.rejectAuthError = function (type) {
        return Promise.reject(new _Errors__WEBPACK_IMPORTED_MODULE_16__.AuthError(type));
      };
      AuthClass.prototype.rejectNoUserPool = function () {
        var type = this.noUserPoolErrorHandler(this._config);
        return Promise.reject(new _Errors__WEBPACK_IMPORTED_MODULE_16__.NoUserPoolError(type));
      };
      AuthClass.prototype.rememberDevice = function () {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__awaiter)(this, void 0, void 0, function () {
          var currUser, error_2;
          return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__generator)(this, function (_a) {
            switch (_a.label) {
              case 0:
                _a.trys.push([0, 2,, 3]);
                return [4 /*yield*/, this.currentUserPoolUser()];
              case 1:
                currUser = _a.sent();
                return [3 /*break*/, 3];
              case 2:
                error_2 = _a.sent();
                logger.debug('The user is not authenticated by the error', error_2);
                return [2 /*return*/, Promise.reject('The user is not authenticated')];
              case 3:
                currUser.getCachedDeviceKeyAndPassword();
                return [2 /*return*/, new Promise(function (res, rej) {
                  currUser.setDeviceStatusRemembered({
                    onSuccess: function (data) {
                      res(data);
                    },
                    onFailure: function (err) {
                      if (err.code === 'InvalidParameterException') {
                        rej(new _Errors__WEBPACK_IMPORTED_MODULE_16__.AuthError(_types__WEBPACK_IMPORTED_MODULE_10__.AuthErrorTypes.DeviceConfig));
                      } else if (err.code === 'NetworkError') {
                        rej(new _Errors__WEBPACK_IMPORTED_MODULE_16__.AuthError(_types__WEBPACK_IMPORTED_MODULE_10__.AuthErrorTypes.NetworkError));
                      } else {
                        rej(err);
                      }
                    }
                  });
                })];
            }
          });
        });
      };
      AuthClass.prototype.forgetDevice = function () {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__awaiter)(this, void 0, void 0, function () {
          var currUser, error_3;
          return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__generator)(this, function (_a) {
            switch (_a.label) {
              case 0:
                _a.trys.push([0, 2,, 3]);
                return [4 /*yield*/, this.currentUserPoolUser()];
              case 1:
                currUser = _a.sent();
                return [3 /*break*/, 3];
              case 2:
                error_3 = _a.sent();
                logger.debug('The user is not authenticated by the error', error_3);
                return [2 /*return*/, Promise.reject('The user is not authenticated')];
              case 3:
                currUser.getCachedDeviceKeyAndPassword();
                return [2 /*return*/, new Promise(function (res, rej) {
                  currUser.forgetDevice({
                    onSuccess: function (data) {
                      res(data);
                    },
                    onFailure: function (err) {
                      if (err.code === 'InvalidParameterException') {
                        rej(new _Errors__WEBPACK_IMPORTED_MODULE_16__.AuthError(_types__WEBPACK_IMPORTED_MODULE_10__.AuthErrorTypes.DeviceConfig));
                      } else if (err.code === 'NetworkError') {
                        rej(new _Errors__WEBPACK_IMPORTED_MODULE_16__.AuthError(_types__WEBPACK_IMPORTED_MODULE_10__.AuthErrorTypes.NetworkError));
                      } else {
                        rej(err);
                      }
                    }
                  });
                })];
            }
          });
        });
      };
      AuthClass.prototype.fetchDevices = function () {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__awaiter)(this, void 0, void 0, function () {
          var currUser, error_4;
          return (0,tslib__WEBPACK_IMPORTED_MODULE_13__.__generator)(this, function (_a) {
            switch (_a.label) {
              case 0:
                _a.trys.push([0, 2,, 3]);
                return [4 /*yield*/, this.currentUserPoolUser()];
              case 1:
                currUser = _a.sent();
                return [3 /*break*/, 3];
              case 2:
                error_4 = _a.sent();
                logger.debug('The user is not authenticated by the error', error_4);
                throw new Error('The user is not authenticated');
              case 3:
                currUser.getCachedDeviceKeyAndPassword();
                return [2 /*return*/, new Promise(function (res, rej) {
                  var cb = {
                    onSuccess: function (data) {
                      var deviceList = data.Devices.map(function (device) {
                        var deviceName = device.DeviceAttributes.find(function (_a) {
                          var Name = _a.Name;
                          return Name === 'device_name';
                        }) || {};
                        var deviceInfo = {
                          id: device.DeviceKey,
                          name: deviceName.Value
                        };
                        return deviceInfo;
                      });
                      res(deviceList);
                    },
                    onFailure: function (err) {
                      if (err.code === 'InvalidParameterException') {
                        rej(new _Errors__WEBPACK_IMPORTED_MODULE_16__.AuthError(_types__WEBPACK_IMPORTED_MODULE_10__.AuthErrorTypes.DeviceConfig));
                      } else if (err.code === 'NetworkError') {
                        rej(new _Errors__WEBPACK_IMPORTED_MODULE_16__.AuthError(_types__WEBPACK_IMPORTED_MODULE_10__.AuthErrorTypes.NetworkError));
                      } else {
                        rej(err);
                      }
                    }
                  };
                  currUser.listDevices(MAX_DEVICES, null, cb);
                })];
            }
          });
        });
      };
      return AuthClass;
    }();
    var Auth = new AuthClass(null);
    _aws_amplify_core__WEBPACK_IMPORTED_MODULE_17__.Amplify.register(Auth);
    //# sourceMappingURL=Auth.js.map
    /***/ }),

/***/ 23966:
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   AppRoutingModule: () => (/* binding */ AppRoutingModule),
    /* harmony export */   routes: () => (/* binding */ routes)
    /* harmony export */ });
    /* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ 97582);
    /* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 75187);
    /* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 65879);
    /* harmony import */ var _shared_app_layout_app_layout_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @shared/app-layout/app-layout.component */ 8976);
    /* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 96814);
    
    
    
    
    
    const routes = [{
      path: 'main',
      component: _shared_app_layout_app_layout_component__WEBPACK_IMPORTED_MODULE_0__.AppLayoutComponent,
      loadChildren: () => Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! ./idiada/view/view.module */ 64350)).then(m => m.ViewModule)
    }, {
      path: '**',
      redirectTo: 'main'
    }];
    let AppRoutingModule = class AppRoutingModule {};
    AppRoutingModule = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.NgModule)({
      imports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule.forRoot(routes, {
        onSameUrlNavigation: 'reload'
      }), _angular_common__WEBPACK_IMPORTED_MODULE_4__.CommonModule],
      exports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule]
    })], AppRoutingModule);
    
    
    /***/ }),
    
    /***/ 66401:
    /*!**********************************!*\
      !*** ./src/app/app.component.ts ***!
      \**********************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   AppComponent: () => (/* binding */ AppComponent)
    /* harmony export */ });
    /* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ 97582);
    /* harmony import */ var _app_component_html_ngResource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app.component.html?ngResource */ 33383);
    /* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 65879);
    
    
    
    let AppComponent = class AppComponent {
      constructor() {
        this.title = 'dna-ng';
      }
    };
    AppComponent = (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.Component)({
      selector: 'app-root',
      template: _app_component_html_ngResource__WEBPACK_IMPORTED_MODULE_0__
    })], AppComponent);
    
    
    /***/ }),
    
    /***/ 78629:
    /*!*******************************!*\
      !*** ./src/app/app.module.ts ***!
      \*******************************/
    /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
    
    "use strict";
    __webpack_require__.r(__webpack_exports__);
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   AppModule: () => (/* binding */ AppModule),
    /* harmony export */   createApiService: () => (/* binding */ createApiService),
    /* harmony export */   createTranslateLoader: () => (/* binding */ createTranslateLoader),
    /* harmony export */   initializeApp: () => (/* binding */ initializeApp)
    /* harmony export */ });
    /* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! tslib */ 97582);
    /* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/core */ 65879);
    /* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/platform-browser */ 6593);
    /* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app.component */ 66401);
    /* harmony import */ var idiada_angular_services__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! idiada-angular-services */ 78721);
    /* harmony import */ var idiada_angular_utils__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! idiada-angular-utils */ 72734);
    /* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/common/http */ 69862);
    /* harmony import */ var _ngx_translate_http_loader__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @ngx-translate/http-loader */ 80383);
    /* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @environments/environment */ 20553);
    /* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app-routing.module */ 23966);
    /* harmony import */ var _shared_breadcrumb_breadcrumb_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @shared/breadcrumb/breadcrumb.service */ 42110);
    /* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @angular/common */ 96814);
    /* harmony import */ var primeng_api__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! primeng/api */ 85219);
    /* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/platform-browser/animations */ 82931);
    /* harmony import */ var _idiada_interceptors_http_interceptor_dna_http_interceptor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./idiada/interceptors/http-interceptor/dna-http-interceptor */ 72089);
    /* harmony import */ var _idiada_interceptors_JWTRequestInterceptor__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./idiada/interceptors/JWTRequestInterceptor */ 13759);
    /* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @shared/shared.module */ 56208);
    /* harmony import */ var _view_view_module__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @view/view.module */ 64350);
    /* harmony import */ var ngx_permissions__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ngx-permissions */ 85439);
    /* harmony import */ var _services_Authentication_authentication_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @services/Authentication/authentication.service */ 47527);
    /* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @ngx-translate/core */ 71365);
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    function createTranslateLoader(http) {
      return new _ngx_translate_http_loader__WEBPACK_IMPORTED_MODULE_9__.TranslateHttpLoader(http, './assets/i18n/', '/translations.json');
    }
    function createApiService(http) {
      return new idiada_angular_services__WEBPACK_IMPORTED_MODULE_10__.ApiService(http, _environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment);
    }
    function initializeApp(autheticationService) {
      return () => autheticationService.getUserRoles();
    }
    let AppModule = class AppModule {};
    AppModule = (0,tslib__WEBPACK_IMPORTED_MODULE_11__.__decorate)([(0,_angular_core__WEBPACK_IMPORTED_MODULE_12__.NgModule)({
      declarations: [_app_component__WEBPACK_IMPORTED_MODULE_0__.AppComponent],
      imports: [
      // Angular
      _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_13__.BrowserAnimationsModule, _angular_platform_browser__WEBPACK_IMPORTED_MODULE_14__.BrowserModule, _angular_common_http__WEBPACK_IMPORTED_MODULE_15__.HttpClientModule,
      // Idiada
      idiada_angular_utils__WEBPACK_IMPORTED_MODULE_16__.IdiadaAngularUtilsModule, idiada_angular_services__WEBPACK_IMPORTED_MODULE_10__.IdiadaAngularServicesModule.forRoot({
        environment: _environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment
      }, {
        loader: {
          provide: idiada_angular_services__WEBPACK_IMPORTED_MODULE_10__.ApiService,
          useFactory: createApiService,
          deps: [_angular_common_http__WEBPACK_IMPORTED_MODULE_15__.HttpClient]
        }
      }),
      // Own
      _app_routing_module__WEBPACK_IMPORTED_MODULE_2__.AppRoutingModule, _shared_shared_module__WEBPACK_IMPORTED_MODULE_6__.SharedModule, _view_view_module__WEBPACK_IMPORTED_MODULE_7__.ViewModule, ngx_permissions__WEBPACK_IMPORTED_MODULE_17__.NgxPermissionsModule.forRoot(),
      // External
      _ngx_translate_core__WEBPACK_IMPORTED_MODULE_18__.TranslateModule.forRoot({
        loader: {
          provide: _ngx_translate_core__WEBPACK_IMPORTED_MODULE_18__.TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [_angular_common_http__WEBPACK_IMPORTED_MODULE_15__.HttpClient]
        },
        isolate: false
      })],
      providers: [{
        provide: _angular_common__WEBPACK_IMPORTED_MODULE_19__.LocationStrategy,
        useClass: _angular_common__WEBPACK_IMPORTED_MODULE_19__.HashLocationStrategy
      }, {
        provide: _angular_common_http__WEBPACK_IMPORTED_MODULE_15__.HTTP_INTERCEPTORS,
        useClass: _idiada_interceptors_JWTRequestInterceptor__WEBPACK_IMPORTED_MODULE_5__.JWTRequestInterceptor,
        multi: true
      }, {
        provide: _angular_common_http__WEBPACK_IMPORTED_MODULE_15__.HTTP_INTERCEPTORS,
        useClass: _idiada_interceptors_http_interceptor_dna_http_interceptor__WEBPACK_IMPORTED_MODULE_4__.DNAHttpInterceptor,
        multi: true
      }, {
        provide: _angular_core__WEBPACK_IMPORTED_MODULE_12__.APP_INITIALIZER,
        useFactory: initializeApp,
        deps: [_services_Authentication_authentication_service__WEBPACK_IMPORTED_MODULE_8__.AuthenticationService],
        multi: true
      }, _shared_breadcrumb_breadcrumb_service__WEBPACK_IMPORTED_MODULE_3__.BreadcrumbService, primeng_api__WEBPACK_IMPORTED_MODULE_20__.MessageService, primeng_api__WEBPACK_IMPORTED_MODULE_20__.ConfirmationService, _angular_common__WEBPACK_IMPORTED_MODULE_19__.DatePipe],
      bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_0__.AppComponent]
    })], AppModule);
    
    
    /***/ }),
    /***/ 28083:
/*!**************************************************!*\
  !*** ./src/app/idiada/domain/chart/barObject.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BarObject: () => (/* binding */ BarObject)
/* harmony export */ });
class BarObject {
  constructor() {
    this.activeTarget = false;
    this.hideNames = false;
    this.showNumbers = false;
    this.rotateValues = false;
    this.viewMode = '';
    this.datatableCol = false;
    this.datatableData = false;
  }
}

/***/ })
}]);
