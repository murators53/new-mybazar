// middleware.ts, tarayıcıda değil, Next.js'in sunucu tarafında çalışır.
//belirtilen route’lara gelen her istekte otomatik çalışır.
// middleware her istekte çalışır mı?	
// ❌ Sadece matcher ile eşleşenlerde
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
/* 
🧪 Farkı Ne?
Özellik	                            Request	NextRequest
url	                                ✅	    ✅
headers	                            ✅      	✅
cookies.get()	                    ❌      	✅
geo, ip gibi Next özel veriler	    ❌	    ✅
middleware içinde desteklenir mi?	❌	    ✅
*/

// middleware() fonksiyonu, belirtilen matcher route’lara gelen her istekte otomatik çalışır.
export function middleware(req: NextRequest) {
    // req (NextRequest), gelen HTTP isteği temsil eder.
    const token = req.cookies.get('refreshToken')?.value;

    // Istekle birlikte gelen refreshToken cookie’sini alıyoruz.
    // Eğer token yoksa, kullanıcı muhtemelen oturum açmamıştır.

    if (!token) {
        //Eğer token yoksa → kullanıcı login olmamış demektir → /login sayfasına yönlendiriyoruz.
        return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
        // Eğer token varsa → geçerli mi diye kontrol ediyoruz. refreshToken’ı çözümlemeye
        //Geçerliyse (imza doğru ve süresi dolmamışsa) hata fırlatmaz
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        // 🔐 Admin sayfasına sadece isAdmin true olanlar girebilir
        if (req.nextUrl.pathname.startsWith('/admin')) {
            if (!decoded.isAdmin) {
                return NextResponse.redirect(new URL('/', req.url));
            }
        }

        return NextResponse.next();
        //Token geçerliyse → kullanıcı yetkili demektir 
        // → isteğin devam etmesine izin veriyoruz.

    } catch (error) {
        console.error('JWT doğrulama hatası:', error);
        return NextResponse.redirect(new URL('/login', req.url));
        //Eğer token geçersizse (bozuksa, süresi dolmuşsa) 
        // → kullanıcıyı tekrar /login sayfasına yönlendiriyoruz.
    }
}

export const config = {
    // Eğer sadece bazı route’ları korumak istersen, matcher ayarıyla bunu yapabilirsin:
    matcher: ['/profiile', '/profile/:path*', '/cart', '/category/:path*', '/admin/:path*',]
}
//Bu ayar sayesinde sadece belirlediğin route'lar için middleware çalışır.
// Yani /login, /register, / gibi açık sayfalara dokunmaz.
