@app.get("/subscriptions", response_model=List[Subscription])
def get_all_subscriptions(skip: int = 0, limit: int = 10):
    """Returnează toate subscripțiile (cu paginare server-side)."""
    # skip = câte elemente sărim (ex: pagina 2 începe de la skip=10)
    # limit = câte elemente returnăm maxim per pagină
    return db_subscriptions[skip : skip + limit]