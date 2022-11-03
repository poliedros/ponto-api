# api-gateway

<a></a><img src="https://img.shields.io/github/workflow/status/poliedros/api-gateway/test%20code" alt="Github Actions" /></a>
<a>[![Coverage Status](https://coveralls.io/repos/github/poliedros/api-gateway/badge.svg?branch=main)](https://coveralls.io/github/poliedros/api-gateway?branch=main)</a>

## Description

Api gateway is the facade api for projects

## Authentication

To keep a route safe, use _JwtAuthGuard_

```
@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@Request() req) {
  return req.user;
}
```

## Authorization

Add your role to role.enums.ts

```
export enum Role {
  Admin = 'admin',
  Other = 'other',
}
```

Now, you can use it on your controllers

```
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Get('example')
get(@Request() req) {
  return ['Hello world'];
}
```

## Interceptors

### Timeout

Timeout interceptor is global and used to timeout a requisition if it takes more than 10 seconds.

```
app.useGlobalInterceptors(new TimeoutInterceptor());
```

To change this time, jump to timeout.interceptor.ts and change this lin:

```
return next.handle().pipe(timeout(10000));
```

## Health

Health module is used to check if the API itself is up and running and to check other services.

## Users

Module to keep users' data saved. It can be used with whatever database the project requires.

## Architecture

![Solution architecture](/docs/assets/architecture.png 'Solution architecture')

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```
