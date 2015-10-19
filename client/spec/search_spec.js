
'use strict';

var openUrl = require('./helpers/utils').open,
    workspace = require('./helpers/pages').workspace,
    content = require('./helpers/pages').content,
    globalSearch = require('./helpers/search'),
    authoring = require('./helpers/authoring');

describe('Search', function() {

    beforeEach(function(done) {
        openUrl('/#/workspace/content').then(done);
    });

    it('can search by search field', function() {
        workspace.switchToDesk('SPORTS DESK').then(content.setListView);
        expect(element.all(by.repeater('items._items')).count()).toBe(2);

        var searchTextbox = element(by.id('search-input'));
        searchTextbox.click();
        searchTextbox.clear();
        searchTextbox.sendKeys('item3');
        var focused = browser.driver.switchTo().activeElement().getAttribute('id');
        expect(searchTextbox.getAttribute('id')).toEqual(focused);

        element(by.id('search-button')).click();
        expect(element.all(by.repeater('items._items')).count()).toBe(1);
    });

    it('can search by search within field', function() {
        workspace.switchToDesk('SPORTS DESK').then(content.setListView);
        expect(element.all(by.repeater('items._items')).count()).toBe(2);

        var filterPanelButton = element(by.css('.filter-trigger'));
        filterPanelButton.click();

        var searchTextbox = element(by.id('search_within'));
        searchTextbox.clear();
        searchTextbox.sendKeys('item3');
        element(by.id('search_within_button')).click();
        expect(element.all(by.repeater('items._items')).count()).toBe(1);
        expect(element.all(by.repeater('parameter in tags.selectedKeywords')).count()).toBe(1);
    });

    xit('can search by subject codes field', function () {
        workspace.switchToDesk('SPORTS DESK').then(content.setListView);
        expect(element.all(by.repeater('items._items')).count()).toBe(2);

        var filterPanelButton = element(by.css('.filter-trigger'));
        var subject = element.all(by.css('.dropdown-nested')).first();
        var subjectToggle = subject.element(by.css('.dropdown-toggle'));

        filterPanelButton.click();
        element.all(by.css('[ng-click="toggleModule()"]')).first().click();
        subjectToggle.click();
        subject.all(by.css('.nested-toggle')).first().click();
        subject.all(by.repeater('term in activeTree')).first().click();

        expect(element.all(by.repeater('t in item[field]')).count()).toBe(1);
        expect(element.all(by.repeater('parameter in tags.selectedParameters')).count()).toBe(1);
        expect(element.all(by.repeater('item in items._items')).count()).toBe(0);
    });

    it('can search by priority field', function () {
        workspace.switchToDesk('SPORTS DESK').then(content.setListView);
        expect(element.all(by.repeater('items._items')).count()).toBe(2);

        var filterPanelButton = element(by.css('.filter-trigger'));
        filterPanelButton.click();
        expect(element.all(by.repeater('(key,value) in aggregations.priority')).count()).toBe(1);
        var priority3 = element.all(by.repeater('(key,value) in aggregations.priority')).first();
        priority3.click();
        expect(element.all(by.repeater('items._items')).count()).toBe(1);
    });

    it('can search by from desk field', function() {
        workspace.switchToDesk('SPORTS DESK').then(content.setListView);
        expect(element.all(by.repeater('items._items')).count()).toBe(2);
        authoring.createTextItem();
        authoring.writeTextToHeadline('From-Sports-To-Politics');
        authoring.writeText('This is Body');
        authoring.writeTextToAbstract('This is Abstract');
        authoring.save();
        expect(element.all(by.repeater('items._items')).count()).toBe(3);
        authoring.sendTo('Politic Desk');
        authoring.confirmSendTo();
        workspace.switchToDesk('POLITIC DESK').then(content.setListView);
        expect(element.all(by.repeater('items._items')).count()).toBe(8);
        globalSearch.openGlobalSearch();
        globalSearch.setListView();
        expect(element.all(by.repeater('items._items')).count()).toBe(11);
        globalSearch.openFilterPanel();
        globalSearch.openParameters();

        globalSearch.selectDesk('from-desk', 'Sports Desk');
        expect(element.all(by.repeater('items._items')).count()).toBe(1);
        expect(globalSearch.getHeadlineElement(0).getText()).toBe('From-Sports-To-Politics');

        globalSearch.selectDesk('to-desk', 'Politic Desk');
        expect(element.all(by.repeater('items._items')).count()).toBe(1);
        expect(globalSearch.getHeadlineElement(0).getText()).toBe('From-Sports-To-Politics');

        globalSearch.selectDesk('from-desk', '');
        expect(element.all(by.repeater('items._items')).count()).toBe(1);
        expect(globalSearch.getHeadlineElement(0).getText()).toBe('From-Sports-To-Politics');

        globalSearch.selectDesk('to-desk', '');
        expect(element.all(by.repeater('items._items')).count()).toBe(11);

    });
});
