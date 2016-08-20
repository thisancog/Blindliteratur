# Blindliteratur
The code for [blindliteratur.de](http://blindliteratur.matthiasplanitzer.de), a dummy text generator in love with German literature classics.

### Installation
Blindliteratur runs on PHP. Simply copy the files to a server. This repository does not come with any literature. You will have to supply your own, e.g. download your favourite books from one of various online ressources.

### How to fill with literature
Blindliteratur feeds on books to be placed in the `/data/content/` subfolder. First, create a `data.txt` file in this folder and fill it with pairs of unique author IDs and author names like this:

```
goethe: Johann Wolfgang v. Goethe
heine: Heinrich Heine
schiller: Friedrich Schiller
```

The chosen author IDs should correspond with further subfolders in that same directory, e.g. `/data/content/goethe`. Fill these folders with further text files containing all the content available to the generator:

```
Die Leiden des jungen Werther.txt
Faust.txt
Iphigenie auf Tauris.txt
```

Or alternatively, if you like to include chapter data, create subfolders – e.g. `/data/content/goethe/Faust` etc. - and put separate text files – `Kapitel I.txt`, `Der Tragödie Erster Teil.txt` and so on – there.

### Some recommendations on text quality
Evidently, the longer your text files, the better. For best results, they should contain no less than 5.000 characters to make sure that the snippet choice is random enough. You may tweak variables `$minsentence` and `$minwords` in `/data/fetch-data.php` to adjust the minimum number of sentences or words, respectively, a snippet will have. Sanitize your texts (e.g. replace triple full stops with ellipses, trim line breaks and repeating spaces etc.) for better results. Due to their line rhythm, drama and poetry don't work as well as prose when its content is regrouped in paragraphs.

### Known issues
- Text that is too short may lead to infinite loops in getSnippet()
- quotes in direct speech not recognized as part of their respective sentences
- remains untested in Internet Explorer

### Features that might or might not be included in a better, future version
- an API for direct reference in external projects
- an option to generate random HTML markup
- more sophisticated sentence recognition
