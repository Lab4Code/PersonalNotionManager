import {createHmac} from "crypto";
import OAuth from "oauth-1.0a";
import {env} from "../../env/server.mjs";
import {z} from "zod";
import {FormData} from "next/dist/compiled/@edge-runtime/primitives/fetch";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import request from 'request-promise';


export default class Instapaper {
    private baseURL = 'https://www.instapaper.com/api/';
    private username: string | undefined;
    private password: string | undefined;
    public token: OAuth.Token | undefined;
    private authorizing: string | undefined;
    private readonly consumer_key;
    private readonly consumer_secret;
    private oauth;

    constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
        this.consumer_key = env.INSTAPAPER_CONSUMER_ID;
        this.consumer_secret = env.INSTAPAPER_CONSUMER_SECRET;
        this.oauth = this.createOAuth();
    }

    createOAuth = () => {
        return new OAuth({
            consumer: {key: this.consumer_key, secret: this.consumer_secret},
            signature_method: 'HMAC-SHA1',
            hash_function: (base_string, key) => createHmac('sha1', key).update(base_string).digest('base64'),
        });
    };

    authorize = () => {
        return new Promise((resolve, reject) => {
            if (this.token) {
                return resolve(this);
            }

            if (this.authorizing) {
                return resolve(this.authorizing);
            }

            if (!this.username || !this.password) {
                return reject('please input valid username and password');
            }

            const options = this.buildAuthOption('1/oauth/access_token', {
                format: 'qline',
                data: {
                    x_auth_username: this.username,
                    x_auth_password: this.password,
                    x_auth_mode: 'client_auth',
                },
            });

            this.authorizing = request(options)
                .then((data: string) => {
                    const token = data.split('&').reduce((acc, current) => {
                        const [key, val] = current.split('=');
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        acc[key] = val;
                        return acc;
                    }, {
                        oauth_token: "",
                        oauth_token_secret: ""
                    });

                    this.token = {
                        key: token.oauth_token,
                        secret: token.oauth_token_secret,
                    };

                    resolve(this);
                }).catch((error: Error) => {
                    this.authorizing = undefined;
                    reject(error);
                });
        });
    };

    buildAuthOption = (url: string, params = {}) => {
        const options = {
            ...params,
            method: 'POST',
            url: this.baseURL + url,
            json: true
        };

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        options.form = this.oauth.authorize(options);

        if (this.token) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            options.headers = this.oauth.toHeader(
                this.oauth.authorize(options, this.token)
            );
        }
        return options;
    };

    request = (url: string, params = {}, version = '1') => {
        return this.authorize()
            .then(() => this.buildAuthOption(version + url, {data: params}))
            .then((options) => request(options));
    };

    listFolders = (params = {}) => this.request('/folders/list');

    listBookmarks = (params = {}) => this.request('/bookmarks/list', params);

    listArchivedBookmarks = (params = {folder_id: "archive", limit: 100}) => this.request('/bookmarks/list', params);
}