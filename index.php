<?php include('header.php'); ?>
		<div id="header">
			<h1 id="page-title">Blindliteratur</h1>
		</div>
		<div id="main">
			<div id="request">
				<div id="shuffle"></div>
				<div>
					<div><ul id="author"></ul></div><ul id="piece"></ul>
				</div>
			</div>
			<div id="cut">
				<div id="type">
					<div id="paras" class="type">Absätze</div>
					<div id="words" class="type">Worte</div>
					<div id="letters" class="type">Zeichen</div>
					<div id="htmlp" class="type">&lt;p&gt;</div>
					<div id="htmlh" class="type">&lt;h1&gt;</div>
				</div>
				<div id="amount">
					<span id="min-amount">1</span>
					<div id="amount-bar">
						<div id="amount-current-bar"></div>
						<div id="amount-current-value">250</div>
						<span id="disclaimer" class="small">Klicken zum Kopieren</span>
					</div>
					<span id="max-amount">500</span>
				</div>
			</div>
			<div id="result">
				<div id="result-inner">
					<div id="refresh"></div>
					<textarea id="result-text" readonly></textarea>
					<div id="copied"><span>Kopiert!</span></div>
				</div>
			</div>
		</div>
		<div id="footer" class="small">
			<div id="footer-left"><a href="/about">Über</a> <a href="http://github.com/thisancog/blindliteratur/" target="__blank">GitHub</a></div>
			<div id="footer-middle"></div>
			<div id="footer-right"><a href="/impressum">Impressum</a></div>
		</div>
	</div>
<!-- Google Analytics -->
</body>
</html>
