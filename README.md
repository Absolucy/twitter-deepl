# twitter-deepl

This is a simple extension that replaces Google translation on Twitter with DeepL translation.

[This requires a DeepL API key, which is *free* for up to 500k characters a month](https://www.deepl.com/pro-checkout/account?productId=1200&yearly=false&trial=false).

## Building

Building it simple:
```shell
$ pnpm run build
```
This will output to the `dist` directory.

If you wish to build a Manifest V3 file, you can do this:
```shell
$ env MANIFEST_VERSION=3 pnpm run build
```

## License

This code reuses the [`getElement` function](https://github.com/insin/tweak-new-twitter/blob/master/tweak-new-twitter.user.js#L838-L894) from the "[Tweak New Twitter](https://github.com/insin/tweak-new-twitter)" extension, which is licensed under the [MIT license](https://github.com/insin/tweak-new-twitter/blob/master/LICENSE).

This extension, however, is under the [Zlib license](LICENSE.md), which is provided below:

### Zlib license

Copyright (c) 2022 Lucy <lucy@absolucy.moe>

This software is provided 'as-is', without any express or implied warranty. In
no event will the authors be held liable for any damages arising from the use of
this software.

Permission is granted to anyone to use this software for any purpose, including
commercial applications, and to alter it and redistribute it freely, subject to
the following restrictions:

1.  The origin of this software must not be misrepresented; you must not claim
    that you wrote the original software. If you use this software in a product,
    an acknowledgment in the product documentation would be appreciated but is
    not required.

2.  Altered source versions must be plainly marked as such, and must not be
    misrepresented as being the original software.

3.  This notice may not be removed or altered from any source distribution.
