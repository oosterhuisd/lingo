<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Laravel</title>

    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet">

    <link href="{{ mix('/css/app.css') }}" rel="stylesheet"></link>

</head>
    <body>
        <div class="flex-center position-ref full-height">
            <nav class="navbar sticky-top navbar-light bg-light">
                <a class="navbar-brand" href="#">Lingo</a>
            </nav>
        </div>
        <div id="app">
            <game-interface></game-interface>
        </div>
        <script src="{{ mix('/js/app.js') }}"></script>
    </body>
</html>
