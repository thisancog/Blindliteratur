# Blindliteratur
The code for [blindliteratur.de](http://blindliteratur.de), a dummy text generator in love with German literature classics.

### Installation
Blindliteratur runs on PHP. Simply copy the files to a server.

### How to fill with literature
Blindliteratur feeds on books to be placed in the `/data/content/` subfolder. First, create a `data.txt` file in this folder and fill it with pairs of author IDs and author names like this:

```
goethe: Johann Wolfgang v. Goethe
heine: Heinrich Heine
schiller: Friedrich Schiller
```

The chosen author IDs should correspond with further subfolders in that same directory, e.g. `/data/content/goethe` and so on. Fill these folders with further text files containing all the content available to the generator:

```
Die Leiden des jungen Werther.txt
Faust.txt
Iphigenie auf Tauris.txt
```

Or alternatively, if you like to include chapter data, create subfolders – e.g. `/data/content/goethe/Faust` etc. - and put separate text files – `Chapter I.txt`, `Der Tragödie Erster Teil.txt` and so on – there.

### Some recommendations on text quality
Evidently, the longer your text files, the better. For best results, they should contain no less than 30.000 characters to make sure that the snippet choice is random enough. You may tweak variables `$minsentence` and `$minwords` in `/data/fetch-data.php` to adjust the minimum number of sentences or words, respectively, a snippet will have. Sanitize your texts (e.g. replacing triple full stops with ellipses, trimming line breaks and repeating spaces etc.) for better results.

### Known issues
- Text that is too short may lead to infinite loops in getSnippet()
- remains untested in Internet Explorer
