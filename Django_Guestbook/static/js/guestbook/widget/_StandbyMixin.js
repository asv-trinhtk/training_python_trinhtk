define([
	'dojo/_base/declare',
	'dojo/_base/lang',
	'dojo/dom-class',
	'dojox/widget/Standby'
], function(
	declare, lang, domClass, Standby
) {

	return declare(null, {

		// standby: [protected] dojox.widget.Standby
		standby: null,

		// standbyTargetNode: [protected] DomNode
		standbyTargetNode: null,

		// standbyType: [protected] String
		//	circle, rakumo, etc...
		standbyType: 'circle',

		// delay showing `standby` until `startup`.
		_standbyBuffered: false,

		postCreate: function() {
			this.inherited(arguments);
			this._appendStandby();
		},

		startup: function() {
			this.inherited(arguments);
			this.standby.startup();
			if (this._standbyBuffered) {
				this.standby.show();
			}
		},

		_appendStandby: function() {
			var target = this.standbyTargetNode || this.domNode,
				standby;

			target = target.domNode || target;

			if (this.standby) {
				standby = this.standby;
			} else {
				standby = this.standby = new Standby();
				this.domNode.appendChild(standby.domNode);
			}
			standby.set('target', target);

			this._appendStandbyClass();
		},

		_appendStandbyClass: function() {
			var parts = this.declaredClass.split('.'),
				baseClass = parts[parts.length - 1];

			baseClass = baseClass.substring(0, 1).toLowerCase() + baseClass.substring(1);
			domClass.add(this.standby.domNode, [
				'standby',
				this.standbyType,
				baseClass + 'Standby'
			].join(' '));
			domClass.add(this.standby._underlayNode, 'underlay');
			domClass.add(this.standby._textNode, 'text');
		},

		destroy: function() {
			this.inherited(arguments);
			if (this.standby) this.standby.destroy();
		},

		onRequest: function(deferred, keepShowing) {
			if (!deferred || !deferred.then) {
				return deferred;
			}

			if (this._started) {
				this.standby.show();
			} else {
				this._standbyBuffered = true;
			}

			var clear = lang.hitch(this, function(keepShowing) {
				if (!keepShowing) {
					this.standby.hide();
				}
				this._standbyBuffered = false;
			});

			deferred.then(lang.hitch(this, clear, keepShowing), lang.hitch(this, clear, false));

			return deferred;
		}
	});
});
